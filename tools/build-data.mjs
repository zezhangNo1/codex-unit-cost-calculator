#!/usr/bin/env node
/*
 * 由 App Store 全地区价格生成 assets/data.js
 * ------------------------------------------------------------------
 * 用法：
 *   node tools/build-data.mjs                 # 用 data/appstore-6448311069.json 缓存生成
 *   node tools/build-data.mjs --fetch         # 先重新抓取再生成
 *
 * 设计原则：
 *   1. 汇率全站唯一。本币 → USD 用来源给的 priceUsd，USD → CNY 一律用 meta.fx.cny，
 *      绝不用来源自己折算的人民币。否则站内会出现两个汇率，横向比较立刻失真。
 *   2. 生成物是派生物，不要手改 data.js。要改口径改这里，然后重新生成。
 *   3. 只收录 Codex 相关的三个档位：Plus / Pro 5x / Pro 20x。
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { fetchAppPrices } from './appstore-prices.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_ID = '6448311069';
const CACHE = path.join(ROOT, 'data', `appstore-${APP_ID}.json`);
const OUT = path.join(ROOT, 'assets', 'data.js');

/* 目标档位：来源里的订阅名 → 我们的档位定义。
   mult 必须与 OpenAI 官方定价页一致，否则单位成本算错。 */
const TARGETS = [
  { src: 'ChatGPT Plus',    id: 'plus',  name: 'ChatGPT Plus', short: 'Plus',     usd: 20,  mult: 1  },
  { src: 'ChatGPT Pro 5x',  id: 'pro5',  name: 'ChatGPT Pro 5x', short: 'Pro 5x', usd: 100, mult: 5  },
  { src: 'ChatGPT Pro 20x', id: 'pro20', name: 'ChatGPT Pro 20x', short: 'Pro 20x', usd: 200, mult: 20 }
];

/* ------------------------------------------------------------------
 * 汇率：每次生成都实时拉取，拉不到才退回上一次的已知值。
 * 汇率和价格是两种时效性完全不同的数据，必须分开对待：
 *   汇率 —— 每天都能拿到新的，所以它真的是「当前」的；
 *   价格 —— App Store 内购价没有公开免授权接口，只能取数据源的记录值，
 *          所以它天然带一个「源站记录日」，绝不可伪装成今天。
 * ---------------------------------------------------------------- */
const FX_FALLBACK = { cny: 6.7268, fetched: '2026-09-16', source: 'open.er-api.com（公开接口，免 Key）' };

async function fetchFx() {
  const today = new Date().toISOString().slice(0, 10);
  const url = 'https://open.er-api.com/v6/latest/USD';
  const pick = (j) => {
    const cny = j && j.rates && j.rates.CNY;
    if (!Number.isFinite(cny)) throw new Error('返回里没有 CNY');
    return { cny: Math.round(cny * 10000) / 10000, fetched: today, source: 'open.er-api.com（公开接口，免 Key）' };
  };
  /* 先试内置 fetch；本机沙箱下 node 的 fetch 会连接超时，但 curl 走得通，所以留一条 curl 兜底 */
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return pick(await r.json());
  } catch (e1) {
    try {
      const out = execFileSync('curl', ['-s', '-m', '20', url], { encoding: 'utf8' });
      return pick(JSON.parse(out));
    } catch (e2) {
      console.warn(`  汇率实时拉取失败（fetch: ${e1.message} / curl: ${e2.message}），沿用 ${FX_FALLBACK.fetched} 的 ${FX_FALLBACK.cny}`);
      return FX_FALLBACK;
    }
  }
}

/* 本币符号。缺的退化成货币代码，不会崩。
   注意 JPY：不能写成 ¥ —— 本站的展示货币就是人民币 ¥，两个 ¥ 并列会直接看错。 */
const SYMBOL = {
  USD: '$', PHP: '₱', PKR: '₨', CAD: 'C$', VND: '₫', EGP: 'E£', BRL: 'R$', JPY: 'JP¥',
  IDR: 'Rp', TRY: '₺', INR: '₹', THB: '฿', CLP: 'CL$', AUD: 'A$', KRW: '₩', TWD: 'NT$',
  AED: 'د.إ', KZT: '₸', ILS: '₪', MXN: 'MX$', SGD: 'S$', NGN: '₦', SAR: 'ر.س', CHF: 'CHF',
  MYR: 'RM', ZAR: 'R', EUR: '€', NOK: 'kr', GBP: '£', DKK: 'kr', COP: 'CO$'
};
/* 这些货币没有小数位（分）概念，按整数展示更贴近真实标价 */
const NO_DECIMAL = new Set(['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'PKR', 'NGN', 'KZT', 'COP']);

function fmtLocal(currency, price) {
  const sym = SYMBOL[currency] || (currency + ' ');
  const n = NO_DECIMAL.has(currency)
    ? String(Math.round(price))
    : (Number.isInteger(price) ? String(price) : price.toFixed(2));
  const grouped = n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sym + grouped;
}

function flag(cc) {
  if (!/^[A-Z]{2}$/.test(cc)) return '';
  return String.fromCodePoint(0x1F1E6 + cc.charCodeAt(0) - 65, 0x1F1E6 + cc.charCodeAt(1) - 65);
}

async function loadRaw(force) {
  if (!force) {
    try {
      return JSON.parse(fs.readFileSync(CACHE, 'utf8'));
    } catch { /* 缓存不存在，落到抓取 */ }
  }
  const raw = await fetchAppPrices(APP_ID);
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, JSON.stringify(raw, null, 2));
  console.log(`已抓取并缓存 → ${path.relative(ROOT, CACHE)}`);
  return raw;
}

function build(raw, FX) {
  const byName = new Map();
  raw.subscriptions.forEach((s) => {
    /* 同名的月度订阅优先（忽略年付同名条目）：period P1M */
    if (s.period !== 'P1M') return;
    byName.set(s.name, s);
  });

  const missing = TARGETS.filter((t) => !byName.has(t.src)).map((t) => t.src);
  if (missing.length) throw new Error('来源缺少档位：' + missing.join('、'));

  /* 以 Plus 的地区清单为基准骨架；三个档位地区集合一致（32 区） */
  const base = byName.get('ChatGPT Plus');
  const order = base.prices.map((p) => p.region);

  const regions = order.map((cc) => {
    const anchor = base.prices.find((p) => p.region === cc);
    const prices = {};
    let obs = '';
    TARGETS.forEach((t) => {
      const sub = byName.get(t.src);
      const p = sub.prices.find((x) => x.region === cc);
      if (!p) return;
      if (!obs) obs = p.observedAt;
      prices[t.id] = {
        local: fmtLocal(p.currency, p.price),
        currency: p.currency,
        usd: p.priceUsd,
        cny: Math.round(p.priceUsd * FX.cny * 100) / 100,
        obs: p.observedAt
      };
    });
    return {
      id: cc,
      name: anchor.regionName,
      flag: flag(cc),
      prices
    };
  });

  /* 两个时间必须分开、且都能各自溯源：
       dataFetchedAt     —— 本站最后一次从数据源读取的时间（每次抓取都推进，是真的「当前」）
       srcObservedRange  —— 数据源记录的该批价格观测日（App Store 不发调价通知，这个日期由源站决定）
     曾经把两者混成一个「观测日」直接展示，结果整站看起来像三个月前的陈货。 */
  const observed = [...new Set(regions.flatMap((r) => Object.values(r.prices).map((p) => p.obs)))].sort();
  const today = new Date().toISOString().slice(0, 10);
  return {
    meta: {
      dataFetchedAt: raw.fetchedAt || today,
      generatedAt: today,
      srcObservedAt: observed[observed.length - 1] || '',
      srcObservedRange: observed.length > 1
        ? `${observed[0]} ~ ${observed[observed.length - 1]}`
        : (observed[0] || ''),
      srcPage: raw.sourcePage,
      caliber: 'iOS App Store 内购（月付）',
      currencyBasis: 'CNY',
      fx: FX,
      plansNote: '倍率取自 OpenAI 官方定价页；官方从不公布每月绝对额度，故不换算 token。'
    },
    app: {
      storeId: raw.appStoreId,
      name: raw.appName,
      developer: 'OpenAI OpCo, LLC',
      category: '效率',
      platforms: ['iOS', 'iPadOS'],
      storeUrl: `https://apps.apple.com/app/id${raw.appStoreId}`
    },
    plans: TARGETS.map((t) => ({ id: t.id, name: t.name, short: t.short, usd: t.usd, mult: t.mult })),
    regions
  };
}

function emit(data) {
  const header = `/*
 * Codex 全球价格 —— 数据源
 * ------------------------------------------------------------------
 * ⚠️ 本文件由 tools/build-data.mjs 生成，请勿手工编辑。
 *    要改数据口径改生成器，然后：node tools/build-data.mjs
 *    要更新价格：node tools/build-data.mjs --fetch
 *
 * 口径：iOS App Store 内购（月付）。
 * 汇率：全站唯一，USD → CNY 一律用 meta.fx.cny，不用来源自己的折算值。
 * 两个时间，别混：
 *   本站抓取日 = ${data.meta.dataFetchedAt}
 *   源站记录日 = ${data.meta.srcObservedRange}（数据源记录的观测时点，不是我们抓取的那天）
 */
`;
  return header + 'window.PRICING_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
}

const force = process.argv.includes('--fetch');
const raw = await loadRaw(force);
const FX = await fetchFx();
const data = build(raw, FX);
fs.writeFileSync(OUT, emit(data));

/* 校验输出：条数、极值、有没有 NaN */
let combos = 0, bad = 0;
data.regions.forEach((r) => Object.values(r.prices).forEach((p) => {
  combos++;
  if (!Number.isFinite(p.cny) || !p.local) bad++;
}));
console.log(`\n已生成 ${path.relative(ROOT, OUT)}`);
console.log(`  地区 ${data.regions.length} × 档位 ${data.plans.length} = ${combos} 条价格（异常 ${bad} 条）`);
console.log(`  本站抓取日 ${data.meta.dataFetchedAt} · 源站记录日 ${data.meta.srcObservedRange}`);
console.log(`  汇率 ${data.meta.fx.cny} CNY/USD @ ${data.meta.fx.fetched}`);
data.plans.forEach((pl) => {
  const rows = data.regions
    .filter((r) => r.prices[pl.id])
    .map((r) => ({ n: r.name, v: r.prices[pl.id].cny }))
    .sort((a, b) => a.v - b.v);
  const hi = rows[rows.length - 1];
  const save = Math.round((1 - rows[0].v / hi.v) * 100);
  console.log(`  ${pl.name.padEnd(16)} ${rows.length} 区 · 最低 ${rows[0].n} ¥${rows[0].v.toFixed(2)}` +
    ` / 最高 ${hi.n} ¥${hi.v.toFixed(2)} · 价差 ${save}%`);
});
if (bad) process.exitCode = 1;
