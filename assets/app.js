/* ==========================================================================
   Codex 全球价格 —— 渲染（纯前端，无依赖）
   --------------------------------------------------------------------------
   两种视图（由 <body data-view> 决定）：
     unit  —— 档位对比：每 1× 额度的成本，三档横比
     price —— 地区对比：选一个档位，看 32 个地区的价格排名
   金额一律人民币。汇率全站唯一，取自 data.js 的 meta.fx；data.js 里的 cny
   已经按这个汇率算好，这里不再二次换算，避免出现两个汇率。
   ========================================================================== */
(function () {
  'use strict';

  var D = window.PRICING_DATA;
  if (!D) return;

  var PLANS = D.plans, REGIONS = D.regions, META = D.meta, APP = D.app, FX = META.fx;
  var VIEW = (document.body && document.body.getAttribute('data-view')) || 'unit';

  /* ==================== 基础工具 ==================== */

  function el(id) { return document.getElementById(id); }
  function setText(id, t) { var n = el(id); if (n) n.textContent = t; }
  function setHTML(id, t) { var n = el(id); if (n) n.innerHTML = t; }

  function group(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function yuan(v) { return '¥' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function x2(v) { return v.toFixed(2) + '×'; }

  function planById(id) {
    for (var i = 0; i < PLANS.length; i++) if (PLANS[i].id === id) return PLANS[i];
    return null;
  }

  /* 某档位有价格的全部地区，按折人民币升序 */
  function ranked(pid) {
    var out = [];
    REGIONS.forEach(function (r) {
      var p = r.prices && r.prices[pid];
      if (p) out.push({ region: r, price: p });
    });
    return out.sort(function (a, b) { return a.price.cny - b.price.cny; });
  }

  /* 某地区某档位的「每 1× 额度」成本 */
  function unit(region, pid) {
    var p = region.prices && region.prices[pid];
    if (!p) return null;
    return p.cny / planById(pid).mult;
  }

  /* 相对同区 Plus 的倍数（区域无关的口径，也是本页唯一能跨区比较的指标） */
  function relToPlus(region, pid) {
    var base = unit(region, 'plus');
    var v = unit(region, pid);
    if (base == null || v == null) return null;
    return v / base;
  }

  function bothPlans(pid) {
    return REGIONS.filter(function (r) {
      return r.prices.plus && r.prices[pid];
    });
  }

  function relRange(pid) {
    var vals = bothPlans(pid).map(function (r) { return relToPlus(r, pid); })
      .filter(function (v) { return v != null; });
    if (!vals.length) return null;
    var sorted = vals.slice().sort(function (a, b) { return a - b; });
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mid: (sorted[0] + sorted[sorted.length - 1]) / 2,
      n: vals.length,
      worse: vals.filter(function (v) { return v > 1.001; }).length,
      better: vals.filter(function (v) { return v < 0.999; }).length,
      allBetter: vals.every(function (v) { return v < 0.999; })
    };
  }

  /* ==================== 公共头部 ==================== */

  function renderHead() {
    setText('fxRate', FX.cny);
    setText('appSub', [
      APP.developer,
      APP.category,
      APP.platforms.join(' / '),
      REGIONS.length + ' 个地区',
      (REGIONS.length * PLANS.length) + ' 条价格'
    ].join(' · '));
    /* chip 两级时间：
       前一个是我们自己抓数据的日期（每次抓取都推进，代表本站新鲜度）；
       后一个是数据源记录的观测日（App Store 不发调价通知，这个日期由源站决定）。
       过去只显示后一个，整站看起来像三个月前的陈货 —— 现在两个都摆出来。 */
    var chip = el('batchChip');
    if (chip) {
      chip.innerHTML = '数据抓取 <b>' + META.dataFetchedAt + '</b>' +
        '<span class="dim"> · 源记录 ' + (META.srcObservedRange || META.srcObservedAt) + '</span>';
      chip.title = '本站于 ' + META.dataFetchedAt + ' 从数据源读取；' +
        '数据源记录的该批价格观测日为 ' + (META.srcObservedRange || META.srcObservedAt) + '。' +
        '两者不同是正常的：App Store 内购价没有公开实时接口，源站只在价格变动时更新记录。\n来源：' + META.srcPage;
    }
  }

  function renderFoot() {
    var days = Math.floor((Date.now() - new Date(META.dataFetchedAt + 'T00:00:00').getTime()) / 86400000);
    var age = days <= 0 ? '就是今天' : ('距今 ' + days + ' 天');
    setHTML('foot',
      '口径：' + META.caliber + '。汇率 ' + FX.cny + ' CNY/USD（' + FX.fetched + '，' + FX.source + '）。' +
      '价格数据本站抓取于 <b>' + META.dataFetchedAt + '</b>（' + age + '），' +
      '数据源记录的观测日为 ' + (META.srcObservedRange || META.srcObservedAt) + '。' +
      '<br><span class="foot-note">为什么是两个日期：App Store 内购价没有公开的实时查询接口，' +
      '我们只能读取数据源的记录值；数据源只在价格发生变动时才刷新该条记录的日期。' +
      '因此「抓取日」始终是当前的，而「源记录日」反映的是这条价格最后一次被记录到的时间。</span>' +
      '<br>价格会变，且各地区的 App Store 调价并不同步，请以你付款页实际显示的金额为准。' +
      '本站只做信息聚合与对比，<strong>不构成订阅建议，不提供任何跨区操作指引</strong>。');
  }

  /* ==================== 视图一：档位对比 ==================== */

  function renderVerdict() {
    var r5 = relRange('pro5'), r20 = relRange('pro20');
    if (!r20) return;
    var n = r20.n;
    var p5 = planById('pro5'), p20 = planById('pro20');

    setHTML('verdictLine',
      '<b>' + p20.name + '</b> 在全部 ' + n + ' 个地区都比 Plus 划算 —— 每 1× 额度的成本稳定是 Plus 的 ' +
      x2(r20.min) + ' ~ ' + x2(r20.max) + '。' +
      '<b>' + p5.name + '</b> 则完全看地区：' + r5.worse + ' 个地区它比 Plus 更贵，' +
      r5.better + ' 个地区更便宜，' + (r5.n - r5.worse - r5.better) + ' 个地区打平。');

    setHTML('verdictNote',
      '「每 1× 额度」= 月付 ÷ 额度倍数，是唯一能跨档位比较的口径。' +
      '额度倍率取自 OpenAI 官方定价页，为 1× / 5× / 20×。三个档位拿到的模型与功能完全一样，差别只有额度和价格。');
  }

  function cardHtml(pid, opt) {
    var pl = planById(pid);
    var isBase = pid === 'plus';
    var rel = isBase ? { min: 1, max: 1, mid: 1 } : relRange(pid);
    var rows = ranked(pid);
    var lo = rows[0], hi = rows[rows.length - 1];
    var units = bothPlans(pid).map(function (r) { return unit(r, pid); });
    var uMin = Math.min.apply(null, units), uMax = Math.max.apply(null, units);

    var tagCls = opt.tagCls ? ' ' + opt.tagCls : '';
    var bigTxt = isBase ? '1.00×' : (x2(rel.min) + ' – ' + x2(rel.max));

    var barW = Math.max(Math.min(rel.mid * 100, 100), 6);
    var barCls = opt.barCls || 'mute';

    return '<div class="plan' + (opt.best ? ' is-best' : '') + '">' +
      '<div class="plan-top">' +
        '<span class="plan-name">' + pl.name + '</span>' +
        '<span class="plan-tag' + tagCls + '">' + opt.tag + '</span>' +
      '</div>' +
      '<div class="plan-price"><span class="v">' + bigTxt + '</span>' +
        '<span class="u">' + (isBase ? '基准' : '相对同区 Plus') + '</span></div>' +
      '<div class="plan-bar"><i class="' + barCls + '" style="width:' + barW.toFixed(1) + '%"></i></div>' +
      (isBase ? '' :
        '<div class="plan-kv hi"><span class="l">每 1× 额度</span>' +
        '<span class="v">' + yuan(uMin) + ' – ' + yuan(uMax) + '</span></div>') +
      '<div class="plan-kv"><span class="l">额度倍数</span><span class="v">' + pl.mult + '×</span></div>' +
      '<div class="plan-kv"><span class="l">月付范围</span>' +
        '<span class="v">' + yuan(lo.price.cny) + ' – ' + yuan(hi.price.cny) + '</span></div>' +
      '<div class="plan-low">最低 <b>' + lo.region.flag + ' ' + lo.region.name + ' ' + yuan(lo.price.cny) + '</b></div>' +
      (opt.foot ? '<div class="plan-low">' + opt.foot + '</div>' : '') +
      '</div>';
  }

  function renderCards() {
    var r5 = relRange('pro5'), r20 = relRange('pro20');
    setHTML('planCards',
      cardHtml('plus', { tag: '基准', foot: '' }) +
      cardHtml('pro5', {
        tag: '看地区', tagCls: 'bad',
        foot: '<b>' + r5.worse + '</b> 个地区比同区 Plus 更贵'
      }) +
      cardHtml('pro20', {
        tag: '唯一稳定划算', tagCls: 'good', best: true, barCls: 'sig',
        foot: '<b>全部 ' + r20.n + ' 个地区</b>都比同区 Plus 便宜'
      }));
  }

  function renderUnitTable() {
    var tb = el('unitBody');
    if (!tb) return;
    var rows = REGIONS.filter(function (r) {
      return r.prices.plus && r.prices.pro20;
    }).map(function (r) {
      return { r: r, u: unit(r, 'pro20'), rel: relToPlus(r, 'pro20'), rel5: relToPlus(r, 'pro5') };
    }).sort(function (a, b) { return a.u - b.u; });

    var html = rows.map(function (o, i) {
      var up = unit(o.r, 'plus'), u5 = unit(o.r, 'pro5'), u20 = o.u;
      var isMin = i === 0;
      /* Pro 5x 比同区 Plus 贵 —— 这是全表唯一需要警示的单元格 */
      var warn5 = o.rel5 != null && o.rel5 > 1.001;
      return '<tr' + (isMin ? ' class="is-min"' : '') + '>' +
        '<td class="rk">' + (i + 1) + '</td>' +
        '<td><div class="rg"><span class="fl">' + o.r.flag + '</span>' +
          '<span class="nm">' + o.r.name + (isMin ? '<span class="tag">最便宜</span>' : '') + '</span></div></td>' +
        '<td class="r cny">' + yuan(up) + '</td>' +
        '<td class="r ' + (warn5 ? 'cell-warn' : 'cny') + '">' + yuan(u5) +
          (warn5 ? '<span class="mini-warn">更贵</span>' : '') + '</td>' +
        '<td class="r cny">' + yuan(u20) + '</td>' +
        '<td class="r loc">' + x2(o.rel) + '</td>' +
      '</tr>';
    }).join('');
    tb.innerHTML = html;
  }

  function renderCheap() {
    var tb = el('cheapBody');
    if (!tb) return;
    var html = PLANS.map(function (pl) {
      var rows = ranked(pl.id);
      var lo = rows[0], hi = rows[rows.length - 1];
      var save = Math.round((1 - lo.price.cny / hi.price.cny) * 100);
      /* 并列最低：折人民币相同的都算，避免把「同价」说成一个地区的功劳 */
      var tied = rows.filter(function (x) { return Math.abs(x.price.cny - lo.price.cny) < 0.02; });
      var loName = tied.map(function (x) { return x.region.flag + ' ' + x.region.name; }).join('、');
      return '<tr>' +
        '<td><span class="nm" style="font-weight:500">' + pl.name + '</span></td>' +
        '<td><div class="rg"><span class="nm">' + loName + '</span></div></td>' +
        '<td class="r cny">' + yuan(lo.price.cny) + '</td>' +
        '<td><div class="rg"><span class="nm">' + hi.region.flag + ' ' + hi.region.name + '</span></div></td>' +
        '<td class="r loc">' + yuan(hi.price.cny) + '</td>' +
        '<td class="r loc">' + save + '%</td>' +
      '</tr>';
    }).join('');
    tb.innerHTML = html;

    setText('cheapSub', '按折人民币 · 全站同一汇率');
    var r20 = relRange('pro20');
    setHTML('cheapFoot',
      '价差 = 1 − 最低价 ÷ 最高价。' +
      '注意 Pro 5x 的价差最小（地区差只有两成出头），而 Plus 与 Pro 20x 接近五成 —— ' +
      '<b>Pro 5x 最不值得为了「换区省钱」而折腾</b>。' +
      '另外，' + r20.n + ' 个地区里 Pro 20x 最贵的一个，仍然比 Plus 最便宜的一个不贵多少，这也是它能全地区胜出的原因。');
  }

  /* ==================== 视图二：地区对比 ==================== */

  var state = { tier: 'plus' };

  function renderPills() {
    var host = el('tierPills');
    if (!host) return;
    host.innerHTML = PLANS.map(function (p) {
      return '<button type="button" class="pill" data-tier="' + p.id + '" aria-pressed="' +
        (state.tier === p.id ? 'true' : 'false') + '">' + p.name + '</button>';
    }).join('');
    Array.prototype.forEach.call(host.querySelectorAll('.pill'), function (b) {
      b.addEventListener('click', function () {
        state.tier = b.getAttribute('data-tier');
        Array.prototype.forEach.call(host.querySelectorAll('.pill'), function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        renderPrice();
      });
    });
  }

  function renderPrice() {
    var pid = state.tier;
    var pl = planById(pid);
    var rows = ranked(pid);
    if (!rows.length) return;

    var lo = rows[0], hi = rows[rows.length - 1];
    var save = Math.round((1 - lo.price.cny / hi.price.cny) * 100);
    var tied = rows.filter(function (x) { return Math.abs(x.price.cny - lo.price.cny) < 0.02; });

    setText('heroBig', yuan(lo.price.cny));
    setHTML('heroOwner',
      '<span class="fl">' + tied.map(function (x) { return x.region.flag; }).join('') + '</span>' +
      '<span>' + tied.map(function (x) { return x.region.name; }).join('、') + '</span>' +
      '<span class="dim" style="font-weight:400">· ' + lo.price.local + '</span>');
    setHTML('heroSave',
      '比最高的一条省 <b>' + save + '%</b> —— 最高是 ' + hi.region.flag + ' ' + hi.region.name +
      ' 的 ' + yuan(hi.price.cny) + '。共收录 <b>' + rows.length + '</b> 个地区。');

    setText('heroRightTitle', pl.name + ' 的价格分布');
    var mid = rows[Math.floor(rows.length / 2)];
    setHTML('heroStats',
      stat('最低', yuan(lo.price.cny), false) +
      stat('中位', yuan(mid.price.cny), true) +
      stat('最高', yuan(hi.price.cny), true) +
      stat('价差', save + '%', true) +
      stat('额度倍数', pl.mult + '×', true));

    setText('rankTitle', pl.name + ' · 全球价格');
    setText('rankSub', rows.length + ' 个地区 · 按折人民币升序');

    var tbody = el('rankBody');
    tbody.innerHTML = rows.map(function (o, i) {
      var isMin = i === 0;
      var w = Math.max(Math.round(lo.price.cny / o.price.cny * 100), 8);
      return '<tr' + (isMin ? ' class="is-min"' : '') + '>' +
        '<td class="rk">' + (i + 1) + '</td>' +
        '<td><div class="rg"><span class="fl">' + o.region.flag + '</span>' +
          '<span class="nm">' + o.region.name + (isMin ? '<span class="tag">最低</span>' : '') + '</span></div></td>' +
        '<td class="r loc">' + o.price.local + ' ' + o.price.currency + '</td>' +
        '<td class="r cny">' + yuan(o.price.cny) + '</td>' +
        '<td class="bar-cell"><span class="bar"><i class="' + (isMin ? 'sig' : '') +
          '" style="width:' + w + '%"></i></span></td>' +
      '</tr>';
    }).join('');

    setHTML('rankFoot',
      '条形长度按「最低价 ÷ 本行价格」绘制，只为看相对差距，不代表绝对值。' +
      '本币标价是 App Store 在该地区的实际标价；折人民币用的是全站唯一汇率 ' + FX.cny + '。' +
      '本站抓取于 ' + META.dataFetchedAt + '，数据源记录的观测日为 ' +
      (META.srcObservedRange || META.srcObservedAt) + '。');
  }

  function stat(label, value, muted) {
    return '<div class="stat"><span class="l">' + label + '</span>' +
      '<span class="v' + (muted ? ' mut' : '') + '">' + value + '</span></div>';
  }

  /* ==================== 初始化 ==================== */

  function init() {
    renderHead();
    renderFoot();
    if (VIEW === 'price') {
      renderPills();
      renderPrice();
    } else {
      renderVerdict();
      renderCards();
      renderUnitTable();
      renderCheap();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CodexPrice = {
    unit: unit, relToPlus: relToPlus, ranked: ranked, relRange: relRange
  };
})();
