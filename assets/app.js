/* Codex 单位成本计算器 —— 计算与渲染逻辑（纯前端，无依赖）
   展示货币：人民币（面向国内用户）。汇率取自 data.js 的 meta.fx。 */
(function () {
  'use strict';

  var D = window.PRICING_DATA;
  if (!D) return;

  var PLANS = D.plans;
  var REGIONS = D.regions;
  var META = D.meta;
  var FX = META.fx || { cny: 1 };

  /* ---------- 计算模型 ---------- */

  function gain(R, u) {
    return (META.weeksPerMonth + R * u) / META.weeksPerMonth;
  }
  function nominal(usd, mult) { return usd / mult; }
  function real(usd, mult, G) { return usd / (mult * G); }

  /* ---------- 货币 ---------- */

  function cnyOf(p) {
    return (p.cny != null) ? p.cny : p.usd * FX.cny;
  }
  function yuan(v) { return '¥' + Math.round(v); }
  function yuan2(v) { return '¥' + v.toFixed(2); }

  /* ---------- 工具 ---------- */

  function pct(v) { return Math.round(v * 100) + '%'; }
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

  /* ---------- 首屏结论（全部由数据推导，不硬编码） ---------- */

  function heroModel() {
    var rows = PLANS.map(function (p) {
      var pr = priceOf('US', p.id);
      if (!pr) return null;
      var cny = cnyOf(pr);
      return {
        id: p.id, name: p.name, short: shortName(p.name), mult: p.mult,
        monthly: cny, unit: cny / p.mult
      };
    }).filter(function (r) { return r !== null; });
    if (rows.length < 2) return null;

    var base = rows[0];
    var best = rows.slice().sort(function (a, b) { return a.unit - b.unit; })[0];
    var dominated = null;
    rows.forEach(function (r) {
      if (dominated) return;
      var pricier = r.monthly > base.monthly * 1.5;
      var sameUnit = Math.abs(r.unit - base.unit) / base.unit < 0.02;
      if (pricier && sameUnit) dominated = r;
    });

    return { rows: rows, base: base, best: best, dominated: dominated };
  }

  function renderHero() {
    var host = el('tiers');
    if (!host) return;
    var m = heroModel();
    if (!m) { host.innerHTML = ''; return; }

    setText('heroMeta', '美区官方价 · 汇率 ' + FX.cny + ' · 更新于 ' + META.updatedAt);

    if (m.dominated) {
      setText('heroTitle', m.dominated.short + ' 每块钱买到的产能，和 ' + m.base.short + ' 一模一样');
      setText('heroSub', '多花的 ' + yuan(m.dominated.monthly - m.base.monthly) +
        ' 只买到更高的上限，没有买到更便宜的单价。');
    } else {
      setText('heroTitle', '同样的钱，买到多少产能');
      setText('heroSub', '按官方倍率折算，每 1× 额度值的钱。');
    }

    var html = '';
    m.rows.forEach(function (r) {
      var cls = '', tag = '';
      if (m.dominated && r.id === m.dominated.id) {
        cls = ' bad';
        tag = '<span class="tag t-mid">不值</span>';
      } else if (r.id === m.best.id && m.best.unit < m.base.unit * 0.99) {
        cls = ' top';
        tag = '<span class="tag t-hi">最优</span>';
      } else {
        tag = '<span class="tag t-na">基准</span>';
      }
      html += '<div class="tcard' + cls + '">' +
        '<div class="tn">' + r.short + ' ' + tag + '</div>' +
        '<div class="tv">' + yuan(r.unit) + '</div>' +
        '<div class="tu">每 1× 额度 · 月付 ' + yuan(r.monthly) + '</div>' +
        '</div>';
    });
    host.innerHTML = html;

    setHTML('heroNote',
      '1× 额度 = 一个 ' + m.base.short + ' 档位的产能，倍率取自官方定价页（' +
      PLANS.map(function (p) { return p.name + ' ' + p.mult + '×'; }).join(' / ') +
      '）。此处为<strong>不含重置红利</strong>的名义口径，纯事实、无用户参数。');
  }

  /* ---------- 分享图（国内传播：能转的是图，不是链接） ---------- */

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
    var W = 1080, H = 1440, PAD = 88;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var c = cv.getContext('2d');
    var F = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei",-apple-system,sans-serif';

    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, W, H);
    c.fillStyle = '#B02A20';
    c.fillRect(0, 0, W, 14);

    c.fillStyle = '#95958e';
    c.font = '400 30px ' + F;
    c.fillText('Codex 单位成本 · 你的每块钱买到多少产能', PAD, 148);

    var title = m.dominated ? ('别买 ' + m.dominated.short) : 'Codex 怎么买更划算';
    c.fillStyle = '#1b1b19';
    c.font = '600 96px ' + F;
    c.fillText(title, PAD, 288);

    c.fillStyle = '#6a6a64';
    c.font = '400 38px ' + F;
    c.fillText(m.dominated
      ? ('它每块钱买到的产能，和 ' + m.base.short + ' 一模一样')
      : '按官方倍率折算，每 1× 额度值的钱', PAD, 366);

    c.fillStyle = '#1b1b19';
    c.font = '600 40px ' + F;
    c.fillText('每 1× 额度的成本（人民币）', PAD, 486);

    var maxU = Math.max.apply(null, m.rows.map(function (r) { return r.unit; }));
    var y = 540, rowH = 190, barW = W - PAD * 2;
    m.rows.forEach(function (r) {
      var bad = m.dominated && r.id === m.dominated.id;
      var best = r.id === m.best.id && m.best.unit < m.base.unit * 0.99;

      c.fillStyle = bad ? '#FAEEDA' : '#F4F4F1';
      roundRect(c, PAD, y, barW, rowH - 30, 20); c.fill();

      if (bad || best) {
        c.fillStyle = bad ? '#BA7517' : '#3B6D11';
        roundRect(c, PAD, y, 8, rowH - 30, 4); c.fill();
      }

      c.fillStyle = '#1b1b19';
      c.font = '600 44px ' + F;
      c.fillText(r.short, PAD + 40, y + 62);

      c.fillStyle = '#6a6a64';
      c.font = '400 30px ' + F;
      c.fillText('月付 ' + yuan(r.monthly) + ' · ' + r.mult + '× 额度', PAD + 40, y + 108);

      c.fillStyle = bad ? '#854F0B' : '#1b1b19';
      c.font = '600 68px ' + F;
      c.textAlign = 'right';
      c.fillText(yuan(r.unit), W - PAD - 40, y + 78);
      c.textAlign = 'left';

      if (bad || best) {
        c.fillStyle = bad ? '#BA7517' : '#3B6D11';
        c.font = '600 28px ' + F;
        c.textAlign = 'right';
        c.fillText(bad ? '不值' : '最优', W - PAD - 40, y + 118);
        c.textAlign = 'left';
      }
      y += rowH;
    });

    var ny = y + 40;
    c.strokeStyle = 'rgba(0,0,0,.12)';
    c.lineWidth = 2;
    c.beginPath(); c.moveTo(PAD, ny); c.lineTo(W - PAD, ny); c.stroke();

    c.fillStyle = '#6a6a64';
    c.font = '400 28px ' + F;
    var notes = [
      '口径：美区官方 Web 标价，倍率取自官方定价页。',
      '官方只公布倍率，从不公布每月绝对额度，故不换算 token。',
      '汇率 ' + FX.cny + '（' + FX.fetched + '）· 数据快照 ' + META.updatedAt + '。',
      '本站只做信息聚合与对比，不构成订阅建议，不提供跨区操作指引。'
    ];
    notes.forEach(function (t, i) { c.fillText(t, PAD, ny + 56 + i * 44); });

    c.fillStyle = '#B02A20';
    c.font = '600 32px ' + F;
    c.fillText('codex-unit-cost-calculator', PAD, H - 62);

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
        if (tip) tip.textContent = '已保存图片，可直接发到小红书或微信。';
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
        '<div class="un">最优 ' + yuan2(all[0]) + '</div></div>';

    meta.innerHTML =
      '<div>本币价 <b>' + p.local + '</b>（' + yuan2(cny) + '）</div>' +
      '<div>口径 <b>' + p.caliber + '</b></div>' +
      '<div>来源 <b>' + p.source + '</b></div>' +
      '<div>抓取时间 <b>' + p.fetched + '</b></div>' +
      '<div>置信度 ' + confTag(p.conf) + '</div>' +
      (p.note ? '<div style="width:100%">' + p.note + '</div>' : '');
  }

  /* ---------- 首页「三档横向对比」：跟着滑块联动 ---------- */

  function renderTierTable(G, u) {
    var tb = el('tierTable');
    if (!tb) return;

    var rows = PLANS.map(function (p) {
      var pr = priceOf('US', p.id);
      if (!pr) return null;
      var cny = cnyOf(pr);
      return {
        name: p.name, cny: cny, mult: p.mult,
        nm: cny / p.mult, rl: cny / p.mult / G
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
        '<td class="num">' + yuan(r.cny) + '</td>' +
        '<td class="num">' + r.mult + '×</td>' +
        '<td class="num">' + yuan2(r.nm) + '</td>' +
        '<td class="num"><b>' + yuan2(r.rl) + '</b></td>' +
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
      var cny = cnyOf(c.price);
      return {
        label: c.rname + ' × ' + c.pname,
        cny: cny, mult: c.mult, conf: c.price.conf,
        nm: cny / c.mult,
        rl: cny / c.mult / G,
        pd: c.mult * G / cny * 100
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
        '<td class="num">' + yuan(r.cny) + '</td>' +
        '<td class="num">' + r.mult + '×</td>' +
        '<td class="num">' + yuan2(r.nm) + '</td>' +
        '<td class="num"><b>' + yuan2(r.rl) + '</b></td>' +
        '<td class="num">' + r.pd.toFixed(2) + '</td>' +
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
      '「账面最优」为 <b>' + top.label + '</b>（' + yuan2(top.rl) + '），置信度 <b>' + top.conf +
      '</b> —— 便宜的往往正是最没被核验的那个，这是本产品的核心矛盾。' +
      (vRow ? '<br>「已核验最优」为 <b>' + vRow.label + '</b>（' + yuan2(vRow.rl) +
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
          '<td class="num">' + yuan2(cnyOf(pr)) + '</td>' +
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

  /* ---------- 方法论页：把参数从数据里读出来 ---------- */

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
        ' ÷ 倍率 1 = <b>' + yuan2(cnyOf(us[0].price) / 1) + '</b>；Pro 20x 月付 ' +
        yuan2(cnyOf(us[2].price)) + ' ÷ 倍率 20 = <b>' +
        yuan2(cnyOf(us[2].price) / 20) + '</b>。同样是「每 1× 额度」，后者只要一半。');
    }
  }

  /* ---------- 陈旧度提示 ---------- */

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

  /* ---------- 订阅表单 ---------- */

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

    renderHero();
    renderPrices();
    refresh();
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
