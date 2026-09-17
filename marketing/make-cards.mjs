/*
 * 小红书验证笔记 · 图文卡片生成
 * ------------------------------------------------------------
 * 用途：为「需求验证」型笔记生成图片素材。
 * 合规红线：卡片内不得出现域名、二维码、站外账号、"主页/私信"等引导字样。
 * 用法：node marketing/make-cards.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'cards');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1440px;overflow:hidden;background:#FBFAF7;color:#1A1917;
  font-family:"PingFang SC","Hiragino Sans GB",system-ui,sans-serif;
  padding:92px 88px;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
.chip{align-self:flex-start;font-size:27px;letter-spacing:1px;color:#6B6862;
  border:2px solid #E5E2DA;border-radius:999px;padding:14px 34px;background:#FFF}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:150px}
h1{font-size:100px;line-height:1.16;font-weight:600;letter-spacing:-2px}
h1.accent{color:#A87413}
.sub{margin-top:22px;font-size:34px;color:#6B6862;line-height:1.5}
.duo{display:flex;align-items:flex-end;gap:44px;margin-top:60px}
.duo .lab{font-size:28px;color:#6B6862;margin-bottom:14px}
.duo .num{font-size:88px;font-weight:600;letter-spacing:-2px;font-variant-numeric:tabular-nums}
.duo .lo .num{color:#C0392B}
.duo .hi .num{color:#8A6D1F}
.vline{width:2px;height:118px;background:#E5E2DA;margin-bottom:12px}
.foot{padding-top:34px;border-top:2px solid #E5E2DA;
  font-size:24px;color:#8A867E;line-height:1.7}
.head{font-size:48px;font-weight:600;letter-spacing:-1px}
.list{margin-top:36px;display:flex;flex-direction:column;flex:1}
.row{display:flex;align-items:center;flex:1;border-bottom:2px solid #EFEDE6}
.row:last-child{border-bottom:none}
.rank{width:76px;font-size:34px;color:#B4B0A6;font-variant-numeric:tabular-nums}
.name{flex:1;font-size:54px;font-weight:500}
.local{font-size:36px;color:#6B6862;text-align:right;width:300px;font-variant-numeric:tabular-nums}
.usd{font-size:48px;font-weight:600;text-align:right;width:210px;font-variant-numeric:tabular-nums}
.usd.lo{color:#C0392B}
.usd.hi{color:#8A6D1F}
.notes{margin-top:20px;flex:1;display:flex;flex-direction:column;justify-content:space-evenly}
.note{display:flex;gap:22px;font-size:33px;line-height:1.6;color:#3A3833}
.note b{color:#1A1917;font-weight:600;flex:0 0 168px}
.note span{flex:1}
`;

const wrap = (inner) => `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${inner}</body></html>`;

const cards = [
  {
    name: '01-cover',
    html: wrap(`
<span class="chip">iOS App Store 内购 · 32 个地区</span>
<div class="mid">
<h1>同一份 ChatGPT</h1>
<h1 class="accent">价格差了整整一倍</h1>
<div class="duo">
  <div class="lo"><div class="lab">最低 · 菲律宾</div><div class="num">$15.89</div></div>
  <div class="vline"></div>
  <div class="hi"><div class="lab">最高 · 哥伦比亚</div><div class="num">$32.18</div></div>
</div>
</div>
<div class="foot">同样一个月付订阅，不同地区的定价可以差出 2 倍<br>汇率按 $1 ≈ ¥6.72 统一折算</div>`)
  },
  {
    name: '02-cheapest',
    html: wrap(`
<div class="head">最便宜的 5 个地区</div>
<div class="sub">ChatGPT Plus 月付 · 折算后美元价</div>
<div class="list">
  <div class="row"><span class="rank">01</span><span class="name">菲律宾</span><span class="local">₱999</span><span class="usd lo">$15.89</span></div>
  <div class="row"><span class="rank">02</span><span class="name">巴基斯坦</span><span class="local">₨4,900</span><span class="usd lo">$17.64</span></div>
  <div class="row"><span class="rank">03</span><span class="name">加拿大</span><span class="local">C$24.99</span><span class="usd lo">$17.96</span></div>
  <div class="row"><span class="rank">04</span><span class="name">埃及</span><span class="local">E£999.99</span><span class="usd lo">$19.21</span></div>
  <div class="row"><span class="rank">05</span><span class="name">越南</span><span class="local">₫499,000</span><span class="usd lo">$19.26</span></div>
</div>
<div class="foot">美国 $19.99 在 32 个地区里排第 9 位<br>加拿大和埃及都比美国便宜</div>`)
  },
  {
    name: '03-priciest',
    html: wrap(`
<div class="head">最贵的 5 个地区</div>
<div class="sub">ChatGPT Plus 月付 · 折算后美元价</div>
<div class="list">
  <div class="row"><span class="rank">28</span><span class="name">德国</span><span class="local">€22.99</span><span class="usd hi">$26.53</span></div>
  <div class="row"><span class="rank">29</span><span class="name">挪威</span><span class="local">kr249</span><span class="usd hi">$26.64</span></div>
  <div class="row"><span class="rank">30</span><span class="name">英国</span><span class="local">£19.99</span><span class="usd hi">$26.94</span></div>
  <div class="row"><span class="rank">31</span><span class="name">丹麦</span><span class="local">kr179</span><span class="usd hi">$27.63</span></div>
  <div class="row"><span class="rank">32</span><span class="name">哥伦比亚</span><span class="local">CO$99,900</span><span class="usd hi">$32.18</span></div>
</div>
<div class="foot">同样一份 Plus，英国比菲律宾贵 70%<br>哥伦比亚的价格是美国官方价的 1.6 倍</div>`)
  },
  {
    name: '04-method',
    html: wrap(`
<div class="head">这些数字是怎么来的</div>
<div class="sub">说清楚口径，比给结论更重要</div>
<div class="notes">
  <div class="note"><b>价格口径</b><span>iOS App Store 内购的月付标价，非网页版、非年付</span></div>
  <div class="note"><b>换算方式</b><span>各地本币按当日汇率统一折成美元，$1 ≈ ¥6.72</span></div>
  <div class="note"><b>采集时点</b><span>2026 年 9 月 17 日抓取，覆盖 32 个地区</span></div>
  <div class="note"><b>为什么要看</b><span>跨区定价差异长期存在，但多数人默认自己看到的就是标准价</span></div>
</div>
<div class="foot">本表为同一时点快照，定价与汇率都会变动<br>实际以 App Store 结算页面为准</div>`)
  }
];

for (const card of cards) {
  const htmlPath = join(outDir, card.name + '.html');
  writeFileSync(htmlPath, card.html, 'utf8');
  console.log('HTML  ' + htmlPath);
}

/*
 * 截图必须一张一条命令单独跑：Chrome 在本机沙箱下退出时会带走整个 shell，
 * 写在同一个循环里会导致第二张之后全部丢失。
 * 逐张执行（每条命令只截一张）：
 *
 * cd marketing/cards
 * "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *   --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
 *   --force-device-scale-factor=1 --window-size=1080,1440 \
 *   --user-data-dir=/tmp/chrome-cards-01 \
 *   --screenshot="$PWD/01-cover.png" "file://$PWD/01-cover.html"
 *
 * 注意：命令退出码通常是 137（SIGTERM），只要 PNG 生成即为成功。
 */
export const chromeCommand = (name) =>
  `"${CHROME}" --headless=new --disable-gpu --no-sandbox --hide-scrollbars ` +
  `--force-device-scale-factor=1 --window-size=1080,1440 ` +
  `--user-data-dir=/tmp/chrome-cards-${name} --screenshot="cards/${name}.png" ` +
  `"file://$PWD/cards/${name}.html"`;
