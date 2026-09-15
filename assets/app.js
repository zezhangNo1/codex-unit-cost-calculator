/* Codex 单位成本计算器 —— 计算与渲染逻辑（纯前端，无依赖） */
(function () {
  'use strict';

  var D = window.PRICING_DATA;
  if (!D) return;

  var PLANS = D.plans;
  var REGIONS = D.regions;
  var META = D.meta;

  /* ---------- 计算模型 ---------- */

  function gain(R, u) {
    return (META.weeksPerMonth + R * u) / META.weeksPerMonth;
  }
  function nominal(usd, mult) { return usd / mult; }
  function real(usd, mult, G) { return usd / (mult * G); }
  function perDollar(mult, G, usd) { return mult * G / usd; }

  /* ---------- 工具 ---------- */

  function money(v) { return '$' + v.toFixed(2); }
  function money4(v) { return v.toFixed(4); }
  function pct(v) { return Math.round(v * 100) + '%'; }
  function el(id) { return document.getElementById(id); }
  function qs(s) { return document.querySelector(s); }

  function planById(id) {
    for (var i = 0; i < PLANS.length; i++) if (PLANS[i].id === id) return PLANS[i];
    return null;
  }
  function regionById(id) {
    for (var i = 0; i < REGIONS.length; i++) if (REGIONS[i].id === id) return REGIONS[i];
    return null;
  }
  function priceOf(rid, pid) {
    var r = regionById(rid);
    return (r && r.prices && r.prices[pid]) ? r.prices[pid] : null;
  }

  function confTag(c) {
    if (c === '高') return '<span class="tag t-hi">高</span>';
    if (c === '中') return '<span class="tag t-mid">中</span>';
    if (c === '低') return '<span class="tag t-low">低</span>';
    return '<span class="tag t-na">—</span>';
  }

  /* 所有已采集的 区域 × 档位 组合 */
  function combos() {
    var list = [];
    REGIONS.forEach(function (r) {
      PLANS.forEach(function (p) {
        var pr = r.prices ? r.prices[p.id] : null;
        if (pr) list.push({
          rid: r.id, rname: r.name, pid: p.id, pname: p.name,
          mult: p.mult, price: pr
        });
      });
    });
    return list;
  }

  /* ---------- 计算器页 ---------- */

  function buildSelects() {
    var ps = el('plan'), rs = el('region');
    if (!ps || !rs) return;
    PLANS.forEach(function (p) {
      ps.innerHTML += '<option value="' + p.id + '">' + p.name +
        '　' + p.mult + '× Plus 额度</option>';
    });
    REGIONS.forEach(function (r) {
      rs.innerHTML += '<option value="' + r.id + '">' + r.name +
        (r.pending ? '（待采集）' : '') + '</option>';
    });
    ps.value = 'plus';
    rs.value = 'US';
  }

  function readParams() {
    var uEl = el('u'), rEl = el('R');
    var u = uEl ? parseInt(uEl.value, 10) / 100 : META.defaultResetUptake;
    var R = rEl ? (parseFloat(rEl.value) || 0) : META.defaultResetsPerMonth;
    if (el('uval')) el('uval').textContent = pct(u);
    return { u: u, R: R, G: gain(R, u) };
  }

  /* 两个页面共用：控制项变化时只重绘页面上存在的部分 */
  function refresh() {
    var q = readParams();
    renderTierTable(q.G, q.u);
    if (el('out')) renderCalculatorUI(q);
    renderMatrix(q.R, q.u);
  }

  function renderCalculatorUI(q) {
    var out = el('out');
    var u = q.u, R = q.R, G = q.G;
    var pid = el('plan').value;
    var rid = el('region').value;
    var p = priceOf(rid, pid);
    var pl = planById(pid), rg = regionById(rid);
    var meta = el('meta');

    if (!p) {
      out.innerHTML = '<div class="box na">' +
        '<div class="lb">' + rg.name + ' × ' + pl.name + '</div>' +
        '<div class="vl">数据缺失</div>' +
        '<div class="un">该组合尚无已核验价格。我们不会用推算价填坑 —— 缺失就是缺失。</div></div>';
      meta.innerHTML =
        '<div>月均重置次数 <b>' + R + '</b></div>' +
        '<div>重置增益系数 G <b>' + G.toFixed(2) + '×</b></div>' +
        '<div>处理方式 <b>不参与排序</b></div>';
      return;
    }

    var nm = nominal(p.usd, pl.mult);
    var rl = real(p.usd, pl.mult, G);
    var pd = perDollar(pl.mult, G, p.usd);

    var all = combos().map(function (c) { return real(c.price.usd, c.mult, G); })
                      .sort(function (a, b) { return a - b; });
    var rank = 1;
    all.forEach(function (v) { if (v < rl - 1e-9) rank++; });

    out.innerHTML =
      '<div class="box"><div class="lb">名义单位成本</div><div class="vl">' + money(nm) + '</div>' +
        '<div class="un">不含重置红利</div></div>' +
      '<div class="box hi"><div class="lb">实际单位成本</div><div class="vl">' + money(rl) + '</div>' +
        '<div class="un">含重置红利 G=' + G.toFixed(2) + '×</div></div>' +
      '<div class="box"><div class="lb">每 $1 买到产能</div><div class="vl">' + money4(pd) + '</div>' +
        '<div class="un">单位：Plus 额度 / 美元</div></div>' +
      '<div class="box"><div class="lb">全站排名</div><div class="vl">' + rank + ' / ' + all.length + '</div>' +
        '<div class="un">最优 ' + money(all[0]) + '</div></div>';

    meta.innerHTML =
      '<div>月费 <b>' + p.local + '</b>（' + money(p.usd) + '）</div>' +
      '<div>口径 <b>' + p.caliber + '</b></div>' +
      '<div>来源 <b>' + p.source + '</b></div>' +
      '<div>抓取时间 <b>' + p.fetched + '</b></div>' +
      '<div>置信度 ' + confTag(p.conf) + '</div>' +
      (p.note ? '<div style="width:100%">' + p.note + '</div>' : '');
  }

  /* ---------- 首页「这一步算出了什么」：跟着滑块联动，避免文案与计算器不一致 ---------- */

  function renderTierTable(G, u) {
    var tb = el('tierTable');
    if (!tb) return;

    var usPrice = function (pid) {
      var p = priceOf('US', pid);
      return p ? p.usd : null;
    };

    var rows = PLANS.map(function (p) {
      var usd = usPrice(p.id);
      return usd === null ? null : {
        name: p.name, usd: usd, mult: p.mult,
        nm: nominal(usd, p.mult), rl: real(usd, p.mult, G)
      };
    }).filter(function (r) { return r !== null; });
    if (rows.length < 2) { tb.innerHTML = ''; return; }

    var base = rows[0].rl;
    var html = '';
    rows.forEach(function (r) {
      var vsBase = base / r.rl;
      var cls = '', verdict;
      if (Math.abs(vsBase - 1) < 0.01) {
        cls = 'bad';
        verdict = '单位成本与 Plus <b>完全相同</b> —— 它买到的是更高的绝对上限，不是更便宜的单位。';
      } else if (vsBase >= 1.9) {
        cls = 'top';
        verdict = '单位成本约为 Plus 的 1/2。若已撞墙，升到 20x 比升到 5x 更划算。';
      } else if (vsBase > 1.01) {
        verdict = '单位成本约为 Plus 的 1/' + (1 / vsBase).toFixed(1) + '，略有优势。';
      } else {
        verdict = '单位成本高于 Plus，不建议以「省钱」为由选择。';
      }
      html += '<tr class="' + cls + '">' +
        '<td>' + r.name + '</td>' +
        '<td class="num">$' + r.usd + '</td>' +
        '<td class="num">' + r.mult + '×</td>' +
        '<td class="num">' + money(r.nm) + '</td>' +
        '<td class="num"><b>' + money(r.rl) + '</b></td>' +
        '<td class="small">' + verdict + '</td>' +
        '</tr>';
    });
    tb.innerHTML = html;

    var note = el('tierNote');
    if (note) {
      note.innerHTML = '价格为美区官方标价，倍率取官方定价页。实际单位成本按重置利用率 ' + pct(u) +
        '（增益系数 G=' + G.toFixed(2) + '×）计算。重置红利对三档等比例生效，因此不改变三档之间的相对关系。';
    }
  }

  /* ---------- 对比矩阵 ---------- */

  function renderMatrix(R, u) {
    var tb = qs('#matrix tbody');
    if (!tb) return;

    var G = gain(R, u);
    var rows = combos().map(function (c) {
      return {
        label: c.rname + ' × ' + c.pname,
        usd: c.price.usd, mult: c.mult, conf: c.price.conf,
        nm: nominal(c.price.usd, c.mult),
        rl: real(c.price.usd, c.mult, G),
        pd: perDollar(c.mult, G, c.price.usd)
      };
    }).sort(function (a, b) { return a.rl - b.rl; });

    if (!rows.length) { tb.innerHTML = ''; return; }

    var best = rows[0].rl;
    var worst = rows[rows.length - 1].rl;
    var span = Math.max(worst - best, 1e-6);
    var vBest = null;
    rows.forEach(function (r) { if (vBest === null && r.conf === '高') vBest = r.rl; });

    var html = '';
    rows.forEach(function (r, i) {
      var width = 100 - Math.round((r.rl - best) / span * 100);
      var cls = '', bar = 'bar';
      if (i === 0) { cls = 'top'; bar = 'bar red'; }
      else if (i === rows.length - 1) { cls = 'bad'; bar = 'bar gray'; }

      var badge = '';
      if (i === 0) badge += '<span class="tag t-low" style="margin-left:6px">账面最优</span>';
      if (vBest !== null && Math.abs(r.rl - vBest) < 1e-9) {
        badge += '<span class="tag t-hi" style="margin-left:6px">已核验最优</span>';
      }

      html += '<tr class="' + cls + '">' +
        '<td>' + r.label + badge + '</td>' +
        '<td class="num">' + r.usd.toFixed(2) + '</td>' +
        '<td class="num">' + r.mult + '×</td>' +
        '<td class="num">' + money(r.nm) + '</td>' +
        '<td class="num"><b>' + money(r.rl) + '</b></td>' +
        '<td class="num">' + money4(r.pd) + '</td>' +
        '<td><div class="' + bar + '"><i style="width:' + Math.max(width, 4) + '%"></i></div></td>' +
        '</tr>';
    });

    REGIONS.forEach(function (r) {
      if (!r.pending) return;
      html += '<tr class="bad"><td>' + r.name + ' × 全部档位</td>' +
        '<td class="num" colspan="6"><span class="miss">数据缺失，待采集</span></td></tr>';
    });

    tb.innerHTML = html;

    var note = el('matrixNote');
    if (!note) return;
    var top = rows[0];
    var vRow = null;
    rows.forEach(function (r) { if (vRow === null && r.conf === '高') vRow = r; });
    /* G 是产能倍数；换算成成本降幅是 1 - 1/G，不是 G - 1 */
    var capacityUp = Math.round((G - 1) * 100);
    var costDown = Math.round((1 - 1 / G) * 100);

    note.innerHTML =
      '共 <b>' + rows.length + '</b> 条配置参与排序。当前重置利用率下，重置让有效产能提升约 <b>' +
      capacityUp + '%</b>，对应单位成本整体下降约 <b>' + costDown + '%</b>。<br>' +
      '「账面最优」为 <b>' + top.label + '</b>（' + money(top.rl) + '），置信度 <b>' + top.conf +
      '</b> —— 便宜的往往正是最没被核验的那个，这是本产品的核心矛盾。' +
      (vRow ? '<br>「已核验最优」为 <b>' + vRow.label + '</b>（' + money(vRow.rl) +
        '），置信度高，可直接采信。' : '');
  }

  /* ---------- 价格明细表 ---------- */

  function renderPrices() {
    var tb = qs('#prices tbody');
    if (!tb) return;
    var html = '';

    REGIONS.forEach(function (r) {
      var has = false;
      PLANS.forEach(function (p) {
        var pr = r.prices ? r.prices[p.id] : null;
        if (!pr) return;
        has = true;
        html += '<tr>' +
          '<td>' + r.name + '</td>' +
          '<td>' + p.name + '</td>' +
          '<td class="l num">' + pr.local + '</td>' +
          '<td class="small">' + pr.caliber + '</td>' +
          '<td class="num">$' + pr.usd.toFixed(2) + '</td>' +
          '<td class="small">' + pr.source + (pr.url ? ' <a href="' + pr.url + '" target="_blank" rel="noopener">↗</a>' : '') + '</td>' +
          '<td class="l num">' + pr.fetched + '</td>' +
          '<td>' + confTag(pr.conf) + '</td>' +
          '</tr>';
        if (pr.note) {
          html += '<tr><td colspan="8" style="padding-top:0"><div class="miss">' +
            pr.note + '</div></td></tr>';
        }
      });
      if (!has) {
        html += '<tr class="bad"><td>' + r.name + '</td>' +
          '<td colspan="7"><span class="miss">全部档位数据缺失，待采集 —— 不用推算价填充</span></td></tr>';
      }
    });

    tb.innerHTML = html;
  }

  /* ---------- 方法论页：把参数从数据里读出来，避免文案与数据不一致 ---------- */

  function renderMethodMeta() {
    var t = el('metaUpdated');
    if (t) t.textContent = META.updatedAt;
    var r = el('metaResetBasis');
    if (r) r.textContent = META.resetIntervalBasis;
    ['metaWeeks', 'metaWeeks2'].forEach(function (id) {
      var n = el(id);
      if (n) n.textContent = META.weeksPerMonth;
    });
    var lv = el('metaLimitsUrl');
    if (lv) lv.href = META.officialLimitsUrl;
    var lp = el('metaPricingUrl');
    if (lp) lp.href = META.officialPricingUrl;
  }

  /* ---------- 陈旧度提示（护栏指标的可视化） ---------- */

  function renderStaleness() {
    var host = el('staleness');
    if (!host) return;
    var today = new Date(META.updatedAt + 'T00:00:00');
    var days = Math.floor((Date.now() - today.getTime()) / 86400000);
    var total = 0, stale = 0;
    combos().forEach(function (c) {
      total++;
      var d = new Date(c.price.fetched + 'T00:00:00');
      if (!isNaN(d.getTime()) && (Date.now() - d.getTime()) / 86400000 > 45) stale++;
    });
    var ratio = total ? Math.round(stale / total * 100) : 0;
    host.innerHTML = '数据快照更新于 <b>' + META.updatedAt + '</b>（距今 ' + days +
      ' 天）。全部 ' + total + ' 条价格中，超过 45 天未更新 <b>' + stale + ' 条（' + ratio +
      '%）</b>。超过 20% 应视为不可用。';
  }

  /* ---------- 订阅表单（静态站点：交给第三方表单服务，不自己存数据） ---------- */

  function bindSubscribe() {
    var form = el('subForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute('data-endpoint') || '';
      var tip = el('subTip');
      if (!endpoint) {
        if (tip) tip.textContent = '订阅后端尚未接入。静态站点不自建账号体系，请在此填入第三方表单服务地址（见 README）。';
        return;
      }
      var input = form.querySelector('input[type=email]');
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: input.value })
      }).then(function (res) {
        if (tip) tip.textContent = res.ok ? '已收到，价格有变动会通知你。' : '提交失败，请稍后再试。';
        if (res.ok) input.value = '';
      }).catch(function () {
        if (tip) tip.textContent = '网络异常，请稍后再试。';
      });
    });
  }

  /* ---------- 初始化 ---------- */

  function init() {
    buildSelects();
    if (el('u')) el('u').value = Math.round(META.defaultResetUptake * 100);
    if (el('R')) el('R').value = META.defaultResetsPerMonth;

    ['plan', 'region'].forEach(function (id) {
      var n = el(id);
      if (n) n.addEventListener('change', refresh);
    });
    ['u', 'R'].forEach(function (id) {
      var n = el(id);
      if (n) n.addEventListener('input', refresh);
    });

    renderPrices();
    refresh();
    renderMethodMeta();
    renderStaleness();
    bindSubscribe();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 暴露给控制台，便于手工排查 */
  window.CodexCost = {
    gain: gain, nominal: nominal, real: real, perDollar: perDollar, combos: combos
  };
})();
