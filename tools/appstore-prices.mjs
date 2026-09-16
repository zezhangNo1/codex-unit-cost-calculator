#!/usr/bin/env node
/**
 * App Store 各区域内购价提取器
 * ---------------------------------------------------------------------------
 * 从 appstoreprice.org 的应用页提取「全部地区 × 全部订阅档位」的内购价格。
 *
 * 为什么这样做：
 *   - itunes.apple.com/lookup 只给应用本体价，拿不到内购（IAP）价
 *   - apps.apple.com 的 HTML 里没有 IAP 价
 *   - amp-api.apps.apple.com 需要 Bearer token，拿不到
 *   但 appstoreprice.org 是 Next.js，把整张价格表以 RSC 载荷内嵌在 HTML 里
 *   （self.__next_f.push(...)），**无需任何 token 即可解析**。
 *
 * 口径：全部为 **iOS App Store 内购口径**，且每条带 observedAt 观测日期。
 *       这解决了本项目的核心痛点 —— 同口径、跨 32 个地区、带时点。
 *       注意它 ≠ Web 官网价，两者不可混用。
 *
 * 用法：
 *   node tools/appstore-prices.mjs 6448311069              # 打印摘要
 *   node tools/appstore-prices.mjs 6448311069 --json       # 输出完整 JSON
 *   node tools/appstore-prices.mjs 6448311069 -o out.json  # 写入文件
 */

import { writeFileSync } from 'node:fs';

const PAGE_URL = (id) => `https://appstoreprice.org/zh/apps/${id}`;

/* 地区名合规修正：中国台湾 / 中国香港 / 中国澳门 */
const REGION_NAME_FIX = {
  TW: '中国台湾',
  HK: '中国香港',
  MO: '中国澳门',
};

/* RSC 分片是 JS 字符串字面量，需要按 JS 规则反转义 */
function jsUnescapeLiteral(t) {
  try { return JSON.parse(t); } catch { /* 落到手工反转义 */ }
  let out = '';
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c !== '\\') { out += c; continue; }
    const n = t[++i];
    if (n === 'u') { out += String.fromCharCode(parseInt(t.slice(i + 1, i + 5), 16)); i += 4; continue; }
    out += ({ n: '\n', t: '\t', r: '\r', b: '\b', f: '\f' }[n] ?? n);
  }
  return out;
}

/* 从载荷里按括号配对取出一段 JSON 数组/对象 */
function sliceBalanced(s, openIdx, open = '[', close = ']') {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    if (s[i] === open) depth++;
    else if (s[i] === close) { depth--; if (depth === 0) return s.slice(openIdx, i + 1); }
  }
  return null;
}

export async function fetchAppPrices(appStoreId) {
  const res = await fetch(PAGE_URL(appStoreId), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept-Language': 'zh-CN',
    },
  });
  if (!res.ok) throw new Error(`页面请求失败 HTTP ${res.status}`);
  const html = await res.text();

  const chunks = [...html.matchAll(/self\.__next_f\.push\(\[1,(".*?")\]\)/gs)].map(m => m[1]);
  if (!chunks.length) throw new Error('未找到 RSC 载荷，站点结构可能已变（解析逻辑需更新）');
  const payload = chunks.map(jsUnescapeLiteral).join('');

  const subs = [];
  for (const m of payload.matchAll(/\{"id":(\d+),"subscriptionId":"([^"]*)"/g)) {
    const seg = payload.slice(m.index, m.index + 40000);
    const nameM = seg.match(/"nameZh":"([^"]*)"/) || seg.match(/"name":"([^"]*)"/);
    const prIdx = seg.indexOf('"prices":[');
    if (prIdx < 0) continue;
    const arr = sliceBalanced(seg, seg.indexOf('[', prIdx));
    if (!arr) continue;
    let prices;
    try { prices = JSON.parse(arr); } catch { continue; }
    if (!prices.length) continue;

    subs.push({
      subscriptionId: m[2],
      name: nameM ? nameM[1] : '?',
      period: (seg.match(/"period":"([^"]*)"/) || [])[1] || null,
      duration: (seg.match(/"duration":"([^"]*)"/) || [])[1] || null,
      prices: prices.map(p => ({
        region: p.region,
        regionName: REGION_NAME_FIX[p.region] || p.regionName,
        currency: p.currency,
        price: p.price,
        priceUsd: p.priceUsd,
        priceCny: p.priceCny,
        observedAt: p.observedAt,
        isFree: !!p.isFree,
        tier: p.tier ?? null,
      })),
    });
  }

  const appName = (payload.match(/"name":"(ChatGPT[^"]*)"/) || [])[1]
    || (payload.match(/"trackName":"([^"]*)"/) || [])[1]
    || null;

  return { appStoreId, appName, sourcePage: PAGE_URL(appStoreId), fetchedAt: new Date().toISOString().slice(0, 10), subscriptions: subs };
}

/* ------------------------------- CLI ------------------------------- */
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const args = process.argv.slice(2);
  const id = args.find(a => /^\d+$/.test(a));
  if (!id) {
    console.error('用法: node tools/appstore-prices.mjs <appStoreId> [--json] [-o 文件]');
    process.exit(1);
  }
  const outIdx = args.indexOf('-o');
  const data = await fetchAppPrices(id);

  if (args.includes('--json')) {
    const j = JSON.stringify(data, null, 2);
    if (outIdx >= 0 && args[outIdx + 1]) {
      writeFileSync(args[outIdx + 1], j, 'utf-8');
      console.error(`已写入 ${args[outIdx + 1]}`);
    } else {
      console.log(j);
    }
  } else {
    console.log(`App ${id}${data.appName ? ' · ' + data.appName : ''}`);
    console.log(`观测批次: ${data.fetchedAt}   订阅档位: ${data.subscriptions.length}`);
    console.log();
    for (const s of data.subscriptions) {
      const sorted = [...s.prices].sort((a, b) => (a.priceCny ?? 9e9) - (b.priceCny ?? 9e9));
      const lo = sorted[0], hi = sorted[sorted.length - 1];
      const observed = [...new Set(s.prices.map(p => p.observedAt))].sort();
      console.log(`  ${s.name.padEnd(20)} ${String(s.prices.length).padStart(2)} 区 · ` +
        `最低 ${lo.region} ¥${lo.priceCny} / 最高 ${hi.region} ¥${hi.priceCny} · 观测 ${observed.join(',')}`);
    }
    if (outIdx >= 0 && args[outIdx + 1]) {
      writeFileSync(args[outIdx + 1], JSON.stringify(data, null, 2), 'utf-8');
      console.log(`\n已写入 ${args[outIdx + 1]}`);
    }
  }
}
