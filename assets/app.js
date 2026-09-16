/* ==========================================================================
   Codex 单位成本 —— 计算与渲染（纯前端，无依赖）
   展示货币：人民币。汇率取自 data.js 的 meta.fx。
   两种视图（由 <body data-view> 决定）：
     unit  —— 档位对比：按「实际单位成本」排名（本产品的护城河维度）
     price —— 地区对比：按「折人民币实付价」排名（同参考站的语义）
   ========================================================================== */
(function () {
  'use strict';

  var D = window.PRICING_DATA;
  if (!D) return;

  var PLANS = D.plans;
  var REGIONS = D.regions;
  var META = D.meta;
  var FX = META.fx || { cny: 1 };
  var VIEW = (document.body && document.body.getAttribute('data-view')) || 'unit';
  var state = { tier: VIEW === 'price' ? 'plus' : 'all', mode: VIEW === 'price' ? 'price' : 'unit' };

  /* ==================== 计算模型 ==================== */

  function gain(R, u) { return (META.weeksPerMonth + R * u) / META.weeksPerMonth; }
  function nominal(usd, mult) { return usd / mult; }
  function real(usd, mult, G) { return usd / (mult * G); }

  /* ==================== 货币与格式化 ==================== */

  function cnyOf(p) { return (p.cny != null) ? p.cny : p.usd * FX.cny; }
  function group(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function yuan(v) { return '¥' + group(Math.round(v)); }
  function yuan2(v) { return '¥' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(v) { return Math.round(v * 100) + '%'; }

  /* ==================== 工具 ==================== */

  function el(id) { return document.getElementById(id); }
  function qs(s) { return document.querySelector(s); }
  function setText(id, t) { var n = el(id); if (n) n.textContent = t; }
  function setHTML(id, t) { var n = el(id); if (n) n.innerHTML = t; }

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
  function shortName(n) { return n.replace(/^ChatGPT\s*/, ''); }

  /* 国家码 → 旗帜（区域内码点，无需任何图片资源） */
  function flag(cc) {
    if (!/^[A-Z]{2}$/.test(cc)) return '';
    return String.fromCodePoint(0x1F1E6 + cc.charCodeAt(0) - 65,
                                0x1F1E6 + cc.charCodeAt(1) - 65);
  }
  function rshort(r) { return r.short || r.name.replace(/区.*$/, ''); }
  function pshort(p) { return shortName(p.name); }
  /* 极短档位名，给窄栏用 */
  function tiny(p) { var s = shortName(p.name); return s === 'Plus' ? 'Plus' : s.replace(/^Pro\s*/, ''); }

  /* 某区 Plus 的单位成本 —— 「被支配」判断的基准，必须同区比较 */
  function plusUnit(rid, G) {
    var pr = priceOf(rid, 'plus');
    if (!pr) return null;
    return cnyOf(pr) / 1 / G;
  }
  /* 单位成本与该区 Plus 相同、但月付明显更高的档位 = 被支配 */
  function isDominated(r, q) {
    if (!r.mult || r.mult <= 1) return false;
    var base = plusUnit(r.rid, q.G);
    if (base == null) return false;
    return Math.abs(r.val - base) / base < 0.02;
  }

  function confTag(c) {
    if (c === '高') return '<span class="tag t-hi">高</span>';
    if (c === '中') return '<span class="tag t-mid">中</span>';
    if (c === '低') return '<span class="tag t-unv">低</span>';
    return '<span class="tag t-na">—</span>';
  }

  function combos() {
    var list = [];
    REGIONS.forEach(function (r) {
      PLANS.forEach(function (p) {
        var pr = r.prices ? r.prices[p.id] : null;
        if (pr) list.push({ rid: r.id, rname: r.name, pid: p.id, pname: p.name, mult: p.mult, price: pr });
      });
    });
    return list;
  }

  function readParams() {
    var uEl = el('u'), rEl = el('R');
    var u = uEl ? parseInt(uEl.value, 10) / 100 : META.defaultResetUptake;
    var R = rEl ? (parseFloat(rEl.value) || 0) : META.defaultResetsPerMonth;
    if (el('uval')) el('uval').textContent = pct(u);
    return { u: u, R: R, G: gain(R, u) };
  }

  /* ==================== 首屏结论模型（全部由数据推导） ==================== */

  function heroModel() {
    var rows = PLANS.map(function (p) {
      var pr = priceOf('US', p.id);
      if (!pr) return null;
      var cny = cnyOf(pr);
      return { id: p.id, name: p.name, short: shortName(p.name), mult: p.mult, monthly: cny, unit: cny / p.mult };
    }).filter(function (r) { return r !== null; });
    if (rows.length < 2) return null;

    var base = rows[0];
    var best = rows.slice().sort(function (a, b) { return a.unit - b.unit; })[0];
    var dominated = null;
    rows.forEach(function (r) {
      if (dominated || r.id === base.id) return;
      var pricier = r.monthly > base.monthly * 1.5;
      var sameUnit = Math.abs(r.unit - base.unit) / base.unit < 0.02;
      if (pricier && sameUnit) dominated = r;
    });
    return { rows: rows, base: base, best: best, dominated: dominated };
  }

  /* 轴的取整：让刻度落在人读得懂的数上 */
  function niceMax(v) {
    var steps = [10, 20, 30, 40, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 3000, 5000];
    for (var i = 0; i < steps.length; i++) if (steps[i] >= v) return steps[i];
    return Math.ceil(v / 1000) * 1000;
  }

  /* ==================== 首屏：结论 + 单位成本标尺 ==================== */

  function renderHero() {
    var m = heroModel();
    var ruler = el('heroRuler');
    if (!m || !ruler) return;

    setText('heroMeta', '美区官方价 · 汇率 ' + FX.cny + ' · 快照 ' + META.updatedAt);

    if (m.dominated) {
      setText('heroTitle', m.dominated.short + ' 每块钱买到的产能，和 ' + m.base.short + ' 一模一样');
      setText('heroSub', '多付的 ' + yuan(m.dominated.monthly - m.base.monthly) +
        ' 只买到更高的上限，没有买到更便宜的单价。下面是三档在同一根刻度轴上的位置。');
    } else {
      setText('heroTitle', '同样的钱，买到多少产能');
      setText('heroSub', '按官方倍率折算，每 1× 额度要花多少钱。');
    }

    var max = Math.max.apply(null, m.rows.map(function (r) { return r.unit; }));
    var scale = niceMax(max);
    var segN = 3;
    var tickHtml = '';
    for (var t = 0; t <= segN; t++) {
      var v = scale / segN * t;
      var left = (100 / segN * t).toFixed(4);
      tickHtml += '<i style="left:' + left + '%">' + (t === 0 ? '0' : yuan(v)) + '</i>';
    }

    var basePos = (m.base.unit / scale * 100).toFixed(3);
    var bars = '';
    m.rows.forEach(function (r, i) {
      var isDom = m.dominated && r.id === m.dominated.id;
      var isMin = r.id === m.best.id && m.best.unit < m.base.unit * 0.99;
      var cls = isDom ? ' is-bad' : (isMin ? ' is-min' : ' is-base');
      var tag = isDom ? '<span class="tag t-mid">不值</span>'
              : (isMin ? '<span class="tag t-min">最低</span>'
                       : '<span class="tag t-na">基准</span>');
      var w = (r.unit / scale * 100).toFixed(3);
      bars +=
        '<div class="rrow' + cls + '">' +
          '<div class="rname">' + r.short + ' ' + tag + '</div>' +
          '<div class="rrow-track">' +
            '<span class="seg" style="background-image:linear-gradient(to right,var(--tick) 1px,transparent 1px);' +
              'background-size:' + (100 / segN).toFixed(4) + '% 100%"></span>' +
            '<i class="mk" style="left:' + basePos + '%"></i>' +
            '<span class="fill" style="width:' + w + '%;animation-delay:' + (0.06 + i * 0.07).toFixed(2) + 's"></span>' +
          '</div>' +
          '<div class="rrow-val">' + yuan2(r.unit) + '</div>' +
        '</div>';
    });

    ruler.innerHTML =
      '<div class="ruler-cap">' +
        '<span>每 1× 额度的成本</span>' +
        '<span class="ticks">' + tickHtml + '</span>' +
        '<span></span>' +
      '</div>' + bars;

    var foot = el('heroFoot');
    if (foot) {
      if (m.dominated) {
        foot.innerHTML = '<b>' + m.base.short + ' 与 ' + m.dominated.short +
          ' 的条形完全等长</b> —— 这就是「单位产能成本相同」。虚线是基准刻度，' +
          m.dominated.short + ' 恰好落在上面。此处为<strong>名义口径</strong>（不含重置红利），纯事实，不含任何用户参数。';
      } else {
        foot.innerHTML = '此处为<strong>名义口径</strong>，不含重置红利。倍率取自官方定价页。';
      }
    }
  }

  /* ==================== 筛选 pills ==================== */

  function renderPills() {
    var host = el('tierPills');
    if (!host) return;
    var opts = state.mode === 'price'
      ? PLANS.map(function (p) { return { id: p.id, label: p.name }; })
      : [{ id: 'all', label: '全部配置' }].concat(PLANS.map(function (p) { return { id: p.id, label: p.name }; }));

    var html = '';
    opts.forEach(function (o) {
      html += '<button type="button" class="pill" role="tab" data-tier="' + o.id + '" aria-pressed="' +
        (state.tier === o.id ? 'true' : 'false') + '">' + o.label + '</button>';
    });
    host.innerHTML = html;

    Array.prototype.forEach.call(host.querySelectorAll('.pill'), function (b) {
      b.addEventListener('click', function () {
        state.tier = b.getAttribute('data-tier');
        Array.prototype.forEach.call(host.querySelectorAll('.pill'), function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        renderAll(false);
      });
    });
  }

  /* ==================== 排名数据 ==================== */

  function rowsUnit(q) {
    return combos().map(function (c) {
      var cny = cnyOf(c.price);
      return {
        rid: c.rid, pid: c.pid, rname: c.rname, pname: c.pname,
        flag: flag(c.rid), rlabel: rshort(regionById(c.rid)), plabel: pshort(planById(c.pid)),
        mult: c.mult, cny: cny, nm: cny / c.mult,
        val: cny / c.mult / q.G,
        conf: c.price.conf,
        sub: '月付 ' + yuan(cny) + ' · ' + c.mult + '× 额度'
      };
    }).filter(function (r) {
      return state.tier === 'all' || r.pid === state.tier;
    }).sort(function (a, b) { return a.val - b.val; });
  }

  function rowsPrice() {
    var pid = state.tier;
    var list = [];
    REGIONS.forEach(function (r) {
      var pr = r.prices ? r.prices[pid] : null;
      if (!pr) return;
      var p = planById(pid);
      list.push({
        rid: r.id, pid: pid, rname: r.name, pname: p.name,
        flag: flag(r.id), rlabel: rshort(r), plabel: pshort(p),
        mult: p.mult, val: cnyOf(pr), conf: pr.conf,
        sub: pr.local + ' · ' + pr.caliber
      });
    });
    return list.sort(function (a, b) { return a.val - b.val; });
  }

  function currentRows(q) { return state.mode === 'price' ? rowsPrice() : rowsUnit(q); }

  /* ==================== 排名表 ==================== */

  function renderRanking(q) {
    var tb = el('rankBody');
    if (!tb) return;
    var rows = currentRows(q);
    if (!rows.length) {
      tb.innerHTML = '<tr><td colspan="5"><span class="miss">该筛选下暂无已核验价格。</span></td></tr>';
      setHTML('rankNote', '');
      return;
    }

    var min = rows[0].val, max = rows[rows.length - 1].val;
    var span = Math.max(max - min, 1e-9);
    var hiIdx = -1;
    for (var i = 0; i < rows.length; i++) if (rows[i].conf === '高') { hiIdx = i; break; }

    var html = '';
    rows.forEach(function (r, i) {
      var isMin = i === 0;
      var isDom = isDominated(r, q);
      var muted = r.conf === '低';

      var cls = 'rk-row';
      if (isMin) cls += ' is-min';
      else if (isDom) cls += ' is-bad';
      if (muted && !isMin) cls += ' is-muted';

      var badges = '';
      if (isMin) badges += '<span class="tag t-min">账面最低</span>';
      if (i === hiIdx && hiIdx >= 0) badges += '<span class="tag t-hi">已核验最低</span>';
      if (isDom) badges += '<span class="tag t-mid">不值</span>';

      var barCls = isMin ? 'sig' : (isDom ? 'cau' : (muted ? 'mut' : ''));
      var width = Math.max(100 - Math.round((r.val - min) / span * 100), 8);

      html += '<tr class="' + cls + '">' +
        '<td class="c-rank"><span class="rkb' + (isMin ? ' n1' : (i === 1 ? ' n2' : '')) + '">' + (i + 1) + '</span></td>' +
        '<td class="c-cfg"><div class="cfg"><span class="flag">' + r.flag + '</span>' +
          '<span><span class="cfg-name">' + r.rlabel + ' · ' + r.plabel + '</span>' +
          '<span class="cfg-sub">' + r.sub + '</span></span>' + badges + '</div></td>' +
        '<td class="c-unit r"><span class="unit-val">' + yuan2(r.val) + '</span></td>' +
        '<td class="c-bar"><div class="mini"><i class="' + barCls + '" style="width:' + width + '%"></i></div></td>' +
        '<td class="c-conf">' + confTag(r.conf) + '</td>' +
        '</tr>';
    });
    tb.innerHTML = html;

    /* 结论说明 */
    var unit = state.mode === 'unit';
    var top = rows[0];
    var hiRow = hiIdx >= 0 ? rows[hiIdx] : null;
    var parts = [];
    parts.push('共 <b>' + rows.length + '</b> 条已采集配置参与排序，按' +
      (unit ? '实际单位成本' : '折人民币实付价') + '升序。');

    if (unit) {
      var domRow = null;
      rows.forEach(function (r) { if (!domRow && isDominated(r, q)) domRow = r; });
      if (domRow) {
        var b = plusUnit(domRow.rid, q.G);
        var plusRow = null;
        rows.forEach(function (r) { if (!plusRow && r.rid === domRow.rid && r.pid === 'plus') plusRow = r; });
        parts.push('<b>' + domRow.rlabel + ' · ' + domRow.plabel + '</b> 与同区的 <b>Plus</b> 单位成本完全相同（都是 ' +
          yuan2(domRow.val) + '），但月付是它的 ' +
          (plusRow ? Math.round(domRow.cny / plusRow.cny) : Math.round(domRow.mult)) +
          ' 倍 —— <strong>这是本产品的核心结论</strong>。');
      }
    }

    if (top.conf === '低' || top.conf === '中') {
      parts.push('排名第一的 <b>' + top.rlabel + ' · ' + top.plabel + '</b> 置信度为 <b>' + top.conf +
        '</b>；' + (hiRow ? '可直接采信的最低值是 <b>' + hiRow.rlabel + ' · ' + hiRow.plabel +
        '</b>（' + yuan2(hiRow.val) + '）。' : '暂无可直接采信的值。') +
        ' <strong>越便宜越没被核验，是这类信息长期不可用的根因。</strong>');
    } else {
      parts.push('排名第一的 <b>' + top.rlabel + ' · ' + top.plabel + '</b> 置信度为 <b>高</b>，可直接采信。');
    }
    if (unit) {
      parts.push('重置对全部配置等比例生效，<strong>不改变排序</strong>，只整体压低水位。');
    }
    setHTML('rankNote', parts.join(' '));
  }

  /* ==================== 侧栏：最低成本卡 ==================== */

  function renderBest(q) {
    var host = el('bestCard');
    if (!host) return;
    var rows = currentRows(q);
    if (!rows.length) { host.innerHTML = '<div class="lbl">最低</div><p class="miss">暂无数据。</p>'; return; }

    var unit = state.mode === 'unit';
    var top = rows[0];
    var max = rows[rows.length - 1].val;
    var save = Math.round((1 - top.val / max) * 100);
    var hiRow = null;
    rows.forEach(function (r) { if (!hiRow && r.conf === '高') hiRow = r; });
    var trust = top.conf === '高';

    host.innerHTML =
      '<div class="lbl">' + (unit ? '最低单位成本' : '最低实付价') + '</div>' +
      '<div class="big-val">' + yuan2(top.val) + '</div>' +
      '<div class="big-owner' + (trust ? ' trust' : ' warn') + '">' +
        '<span>' + top.flag + '</span><span>' + top.rlabel + ' · ' + top.plabel + '</span>' +
        '<span class="tag ' + (trust ? 't-hi' : 't-unv') + '">' + top.conf + '置信</span>' +
      '</div>' +
      '<div class="big-delta">比最高的一条省 <b>' + save + '%</b>（最高 ' + yuan2(max) + '）</div>' +
      (hiRow && hiRow !== top
        ? '<div class="side-div"></div><div class="side-foot"><div class="row">' +
            '<span>已核验最低</span>' +
            '<span class="v">' + yuan2(hiRow.val) + '</span></div>' +
            '<div class="row" style="margin-top:3px"><span class="miss">' +
            (hiRow.flag ? hiRow.flag + ' ' : '') + hiRow.rlabel + ' · ' + hiRow.plabel +
            ' · 置信度高</span></div></div>'
        : '<div class="side-div"></div><div class="side-foot"><span class="miss">最高置信度的最低值，可直接采信。</span></div>') +
      (unit ? '<div class="side-div"></div><div class="side-foot"><span class="miss">已含重置红利 G=' +
        q.G.toFixed(2) + '×。重置对全部配置等比例生效，不改变排序。</span></div>' : '');
  }

  /* ==================== 侧栏：分布 ==================== */

  function renderDist(q) {
    var host = el('distCard');
    if (!host) return;
    var rows = currentRows(q);
    if (!rows.length) { host.innerHTML = '<div class="lbl">分布</div><p class="miss">暂无数据。</p>'; return; }

    var unit = state.mode === 'unit';
    var min = rows[0].val;
    var label = unit ? '单位成本分布' : '实付价分布';
    var html = '<div class="lbl">' + label + '</div><div class="dist">';
    rows.forEach(function (r, i) {
      var w = Math.max(min / r.val * 100, 3);
      var cls = i === 0 ? 'sig' : (r.conf === '高' ? 'trs' : 'mut');
      html += '<div class="dist-row' + (i === 0 ? ' is-min' : '') + '">' +
        '<span class="dist-lb">' + r.flag + ' ' + r.rlabel +
          (unit ? '·' + tiny(planById(r.pid)) : '') + '</span>' +
        '<span class="dist-bar"><i class="' + cls + '" style="width:' + w.toFixed(1) + '%"></i></span>' +
        '<span class="dist-val">' + yuan(r.val) + '</span>' +
        '</div>';
    });
    html += '</div>' +
      '<div class="mini-legend">' +
        '<span><i class="sw" style="background:var(--signal)"></i>最低</span>' +
        '<span><i class="sw" style="background:var(--trust)"></i>已核验</span>' +
        '<span><i class="sw" style="background:#C9C9C2"></i>未核验</span>' +
      '</div>';
    host.innerHTML = html;
  }

  /* ==================== 计算器输出 ==================== */

  function renderCalculatorUI(q) {
    var out = el('out');
    if (!out) return;
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
      if (meta) meta.innerHTML =
        '<div>月均重置次数 <b>' + R + '</b></div>' +
        '<div>重置增益系数 G <b>' + G.toFixed(2) + '×</b></div>' +
        '<div>处理方式 <b>不参与排序</b></div>';
      return;
    }

    var cny = cnyOf(p);
    var nm = cny / pl.mult;
    var rl = nm / G;

    var all = combos().map(function (c) { return cnyOf(c.price) / c.mult / G; })
                      .sort(function (a, b) { return a - b; });
    var rank = 1;
    all.forEach(function (v) { if (v < rl - 1e-9) rank++; });

    out.innerHTML =
      '<div class="box"><div class="lb">月付（折人民币）</div><div class="vl">' + yuan2(cny) + '</div>' +
        '<div class="un">' + p.local + '</div></div>' +
      '<div class="box"><div class="lb">名义单位成本</div><div class="vl">' + yuan2(nm) + '</div>' +
        '<div class="un">每 1× 额度 · 不含重置</div></div>' +
      '<div class="box hi"><div class="lb">实际单位成本</div><div class="vl">' + yuan2(rl) + '</div>' +
        '<div class="un">含重置红利 G=' + G.toFixed(2) + '×</div></div>' +
      '<div class="box"><div class="lb">全站排名</div><div class="vl">' + rank + ' / ' + all.length + '</div>' +
        '<div class="un">最低 ' + yuan2(all[0]) + '</div></div>';

    if (meta) meta.innerHTML =
      '<div>本币价 <b>' + p.local + '</b>（' + yuan2(cny) + '）</div>' +
      '<div>口径 <b>' + p.caliber + '</b></div>' +
      '<div>来源 <b>' + p.source + '</b></div>' +
      '<div>抓取时间 <b>' + p.fetched + '</b></div>' +
      '<div>置信度 ' + confTag(p.conf) + '</div>' +
      (p.note ? '<div style="flex:1 1 100%; color:var(--ink3)">' + p.note + '</div>' : '');
  }

  /* ==================== 价格明细表 ==================== */

  function renderPrices() {
    var tb = el('priceBody');
    if (!tb) return;
    var html = '';
    REGIONS.forEach(function (r) {
      var has = false;
      PLANS.forEach(function (p) {
        var pr = r.prices ? r.prices[p.id] : null;
        if (!pr) return;
        has = true;
        html += '<tr class="rk-row">' +
          '<td><div class="cfg"><span class="flag">' + flag(r.id) + '</span>' +
            '<span class="cfg-name">' + rshort(r) + '</span></div></td>' +
          '<td><span class="cfg-name">' + pshort(p) + '</span></td>' +
          '<td class="r num">' + pr.local + '</td>' +
          '<td class="cal"><span class="miss">' + pr.caliber + '</span></td>' +
          '<td class="r num"><b>' + yuan2(cnyOf(pr)) + '</b></td>' +
          '<td><span class="miss">' + pr.source +
            (pr.url ? ' <a href="' + pr.url + '" target="_blank" rel="noopener">↗</a>' : '') + '</span></td>' +
          '<td class="r num"><span class="miss">' + pr.fetched + '</span></td>' +
          '<td>' + confTag(pr.conf) + '</td>' +
          '</tr>';
        if (pr.note) {
          html += '<tr><td colspan="8" style="padding-top:0;padding-bottom:14px">' +
            '<div class="miss">' + pr.note + '</div></td></tr>';
        }
      });
      if (!has) {
        html += '<tr class="rk-row"><td><div class="cfg"><span class="flag">' + flag(r.id) + '</span>' +
          '<span class="cfg-name">' + rshort(r) + '</span></div></td>' +
          '<td colspan="7"><span class="miss">全部档位数据缺失，待采集 —— 不用推算价填充</span></td></tr>';
      }
    });
    tb.innerHTML = html;
  }

  /* ==================== 方法论页：把参数从数据里读出来 ==================== */

  function renderMethodMeta() {
    setText('metaUpdated', META.updatedAt);
    setText('metaResetBasis', META.resetIntervalBasis);
    ['metaWeeks', 'metaWeeks2'].forEach(function (id) { setText(id, META.weeksPerMonth); });
    setText('metaFx', FX.cny + '（' + FX.fetched + '）');
    var lv = el('metaLimitsUrl'); if (lv) lv.href = META.officialLimitsUrl;
    var lp = el('metaPricingUrl'); if (lp) lp.href = META.officialPricingUrl;

    var us = combos().filter(function (c) { return c.rid === 'US'; });
    if (us.length >= 3) {
      setHTML('metaWorked', '以美区为例：Plus 月付 ' + yuan2(cnyOf(us[0].price)) +
        ' ÷ 倍率 1 = <b>' + yuan2(cnyOf(us[0].price)) + '</b>；Pro 20x 月付 ' +
        yuan2(cnyOf(us[2].price)) + ' ÷ 倍率 20 = <b>' +
        yuan2(cnyOf(us[2].price) / 20) + '</b>。同样是「每 1× 额度」，后者只要一半。');
    }
  }

  /* ==================== 陈旧度 ==================== */

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
    host.innerHTML = '数据快照 <b>' + META.updatedAt + '</b>（距今 ' + days + ' 天）· 共 ' + total +
      ' 条价格，其中超过 45 天未更新 <b>' + stale + ' 条（' + ratio + '%）</b>，超过 20% 应视为不可用。';
  }

  /* ==================== 顶栏汇率 ==================== */
  function renderTopbar() {
    /* 只填数字 —— "1 USD = … CNY" 的外壳写在 HTML 里，不要在这里重复拼接 */
    setText('fxRate', FX.cny);
  }

  /* ==================== 订阅表单 ==================== */

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

  /* ==================== 分享图 ==================== */

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function buildShareCanvas() {
    var m = heroModel();
    if (!m) return null;
    var W = 1080, H = 1440, PAD = 84;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');
    var SANS = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",-apple-system,sans-serif';
    var SERIF = '"Songti SC","Source Han Serif SC",Georgia,serif';
    var INK = '#15151A', INK2 = '#5C5C66', INK3 = '#94949E';
    var SIG = '#C0402C', CAU = '#8F6410', RULE = 'rgba(21,21,26,.10)';

    c.fillStyle = '#F4F4F1'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#FFFFFF'; roundRect(c, 40, 40, W - 80, H - 80, 26); c.fill();

    c.fillStyle = INK;
    c.font = '600 30px ' + SANS;
    c.fillText('Codex 单位成本', PAD, 152);
    c.fillStyle = INK3;
    c.font = '400 26px ' + SANS;
    c.fillText('每 1× 额度值多少人民币 · ' + META.updatedAt, PAD, 194);

    var title = m.dominated ? ('别买 ' + m.dominated.short) : 'Codex 怎么买更划算';
    c.fillStyle = INK;
    c.font = '600 88px ' + SANS;
    c.fillText(title, PAD, 322);
    c.fillStyle = INK2;
    c.font = '400 34px ' + SANS;
    c.fillText(m.dominated ? ('它每块钱买到的产能，和 ' + m.base.short + ' 一模一样') : '按官方倍率折算',
      PAD, 384);

    /* 标尺：三档落在同一根刻度轴上 */
    var chartX = PAD + 210, chartW = W - PAD - 210 - 190;
    var max = Math.max.apply(null, m.rows.map(function (r) { return r.unit; }));
    var scale = niceMax(max);
    var basePos = chartX + chartW * (m.base.unit / scale);

    c.strokeStyle = RULE; c.lineWidth = 2;
    for (var t = 0; t <= 3; t++) {
      var x = Math.round(chartX + chartW * t / 3) + 0.5;
      c.beginPath(); c.moveTo(x, 470); c.lineTo(x, 470 + m.rows.length * 148 - 40); c.stroke();
      c.fillStyle = INK3; c.font = '400 24px ' + SANS; c.textAlign = 'center';
      c.fillText(t === 0 ? '0' : yuan(scale / 3 * t), x, 452);
      c.textAlign = 'left';
    }

    c.save();
    c.strokeStyle = 'rgba(21,21,26,.30)'; c.lineWidth = 2;
    if (c.setLineDash) c.setLineDash([7, 7]);
    c.beginPath();
    c.moveTo(Math.round(basePos) + 0.5, 470);
    c.lineTo(Math.round(basePos) + 0.5, 470 + m.rows.length * 148 - 40);
    c.stroke();
    c.restore();

    var y = 486;
    m.rows.forEach(function (r) {
      var isDom = m.dominated && r.id === m.dominated.id;
      var isMin = r.id === m.best.id && m.best.unit < m.base.unit * 0.99;
      var col = isDom ? CAU : (isMin ? SIG : INK);

      c.fillStyle = INK;
      c.font = '600 40px ' + SANS;
      c.fillText(r.short, PAD, y + 30);
      c.fillStyle = INK3;
      c.font = '400 26px ' + SANS;
      c.fillText('月付 ' + yuan(r.monthly), PAD, y + 70);

      if (isDom || isMin) {
        c.fillStyle = isDom ? CAU : SIG;
        c.font = '600 24px ' + SANS;
        c.fillText(isDom ? '不值' : '最低单位成本', PAD, y + 108);
      }

      var bw = Math.max(chartW * (r.unit / scale), 8);
      c.fillStyle = col;
      roundRect(c, chartX, y + 6, bw, 18, 6); c.fill();

      c.fillStyle = col;
      c.font = '600 52px ' + SERIF;
      c.textAlign = 'right';
      c.fillText(yuan2(r.unit), W - PAD, y + 46);
      c.textAlign = 'left';

      y += 148;
    });

    var ny = y + 12;
    c.strokeStyle = RULE; c.lineWidth = 2;
    c.beginPath(); c.moveTo(PAD, ny); c.lineTo(W - PAD, ny); c.stroke();

    c.fillStyle = INK2;
    c.font = '400 26px ' + SANS;
    [
      '口径：美区官方 Web 标价，倍率取自官方定价页。',
      '官方只公布倍率，从不公布每月绝对额度，故不换算 token。',
      '汇率 ' + FX.cny + '（' + FX.fetched + '）· 数据快照 ' + META.updatedAt + '。',
      '本站只做信息聚合与对比，不构成订阅建议，不提供跨区操作指引。'
    ].forEach(function (t, i) { c.fillText(t, PAD, ny + 54 + i * 42); });

    c.fillStyle = INK;
    c.font = '600 28px ' + SANS;
    c.fillText('codex-unit-cost-calculator', PAD, H - 92);

    return cv;
  }

  function bindShare() {
    var btn = el('shareBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var tip = el('shareTip');
      var cv;
      try { cv = buildShareCanvas(); } catch (e) { cv = null; }
      if (!cv) { if (tip) tip.textContent = '生成失败，请刷新页面重试。'; return; }
      var done = function (url) {
        var a = document.createElement('a');
        a.href = url;
        a.download = 'codex-单位成本-' + META.updatedAt + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (tip) tip.textContent = '已保存 1080×1440 竖版图片，可直接发到小红书或微信。';
      };
      if (cv.toBlob) {
        cv.toBlob(function (b) {
          if (!b) { if (tip) tip.textContent = '生成失败，请换一个浏览器试试。'; return; }
          done(URL.createObjectURL(b));
        }, 'image/png');
      } else {
        done(cv.toDataURL('image/png'));
      }
    });
  }

  /* ==================== 初始化 ==================== */

  function buildSelects() {
    var ps = el('plan'), rs = el('region');
    if (!ps || !rs) return;
    PLANS.forEach(function (p) {
      ps.innerHTML += '<option value="' + p.id + '">' + p.name + '　' + p.mult + '× 额度</option>';
    });
    REGIONS.forEach(function (r) {
      rs.innerHTML += '<option value="' + r.id + '">' + r.name + (r.pending ? '（待采集）' : '') + '</option>';
    });
    ps.value = 'plus';
    rs.value = 'US';
  }

  function renderAll(withPills) {
    var q = readParams();
    if (withPills) renderPills();
    renderRanking(q);
    renderBest(q);
    renderDist(q);
    if (el('out')) renderCalculatorUI(q);
  }

  function init() {
    buildSelects();
    if (el('u')) el('u').value = Math.round(META.defaultResetUptake * 100);
    if (el('R')) el('R').value = META.defaultResetsPerMonth;

    ['plan', 'region'].forEach(function (id) {
      var n = el(id);
      if (n) n.addEventListener('change', function () { renderAll(false); });
    });
    ['u', 'R'].forEach(function (id) {
      var n = el(id);
      if (n) n.addEventListener('input', function () { renderAll(false); });
    });

    renderTopbar();
    renderHero();
    renderPrices();
    renderAll(true);
    renderMethodMeta();
    renderStaleness();
    bindSubscribe();
    bindShare();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 暴露给控制台，便于手工排查 */
  window.CodexCost = {
    gain: gain, nominal: nominal, real: real, cnyOf: cnyOf, combos: combos,
    heroModel: heroModel, buildShareCanvas: buildShareCanvas
  };
})();
