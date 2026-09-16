/*
 * Codex 单位成本计算器 —— 数据源（唯一数据源，手工维护）
 * ------------------------------------------------------------------
 * 维护方式：直接改这个文件，然后 git commit + push，站点自动更新。
 * 不需要数据库、不需要后台。理由见 README.md「为什么不用数据库」。
 *
 * 展示货币：人民币（面向国内用户）。汇率存于 meta.fx，逐次手工更新。
 *
 * 字段说明：
 *   usd      折美元金额（计算基准）
 *   cny      来源直接给出人民币时填此项，优先于 usd × 汇率
 *   local    本币标价原文
 *   caliber  价格口径：Web / iOS App Store / Google Play / 未标注
 *   source   来源名称
 *   url      来源链接
 *   fetched  抓取日期 YYYY-MM-DD
 *   conf     置信度：高 / 中 / 低
 *   note     口径冲突或其他必须告知用户的说明
 *
 * 铁律 1：抓不到就留空（不写进 regions[].prices），不要用推算价填坑。
 * 铁律 2：每条价格必须标清口径。Web 价 ≠ iOS 内购价 ≠ Google Play 价，
 *         不标口径是同类站点最大的失真来源。
 */

window.PRICING_DATA = {
  meta: {
    updatedAt: '2026-09-16',
    officialPricingUrl: 'https://developers.openai.com/codex/pricing',
    officialLimitsUrl: 'https://www.chatgpt.com/codex/pricing',
    weeksPerMonth: 4.33,
    defaultResetsPerMonth: 7.3,
    defaultResetUptake: 0.5,
    resetIntervalBasis: '各追踪站中位间隔 4.1 天（30 ÷ 4.1 ≈ 7.3）',

    /* 汇率：免 Key 公开接口，手工更新。来源 https://open.er-api.com/v6/latest/USD */
    fx: {
      cny: 6.7268,
      php: 62.869248,
      fetched: '2026-09-16',
      source: 'open.er-api.com（公开接口，免 Key）'
    }
  },

  /* 倍率来自官方定价页，是官方唯一公布的口径。
     官方从不公布「每月等于多少 credits」的绝对值，因此任何绝对产能都是估算。 */
  plans: [
    { id: 'plus',  name: 'ChatGPT Plus', usd: 20,  mult: 1  },
    { id: 'pro5',  name: 'Pro 5x',       usd: 100, mult: 5  },
    { id: 'pro20', name: 'Pro 20x',      usd: 200, mult: 20 }
  ],

  regions: [
    {
      id: 'US',
      name: '美区（官方）',
      pending: false,
      prices: {
        plus: {
          usd: 20, local: '$20.00', caliber: 'Web 官方标价',
          source: 'OpenAI 官方定价页',
          url: 'https://developers.openai.com/codex/pricing',
          fetched: '2026-09-16', conf: '高', note: ''
        },
        pro5: {
          usd: 100, local: '$100.00', caliber: 'Web 官方标价',
          source: 'OpenAI 官方定价页',
          url: 'https://developers.openai.com/codex/pricing',
          fetched: '2026-09-16', conf: '高', note: ''
        },
        pro20: {
          usd: 200, local: '$200.00', caliber: 'Web 官方标价',
          source: 'OpenAI 官方定价页',
          url: 'https://developers.openai.com/codex/pricing',
          fetched: '2026-09-16', conf: '高', note: ''
        }
      }
    },
    {
      id: 'PH',
      name: '菲律宾区',
      pending: false,
      prices: {
        plus: {
          usd: 15.89, cny: 106.89, local: '₱999 PHP', caliber: 'iOS App Store 内购',
          source: 'App Store 菲律宾区（经 appstoreprice.org 聚合核对）',
          url: 'https://apps.apple.com/ph/app/id6448311069',
          fetched: '2026-09-16', conf: '中',
          note: '这是 iOS 内购口径，不是 Web 价。此前流传的三个数字差异已定位：¥109.82 ≈ 本条目（iOS 内购）；geopriced 报 $9.76 疑为 Web 或未含税口径；itscheaper.in 报 ₱1,200 疑为含税或另一时点。三者为口径差异，不是互相证伪。'
        },
        pro20: {
          usd: 164.93, cny: 1109.41, local: '¥1,109.41（原来源直接以人民币标注）', caliber: 'iOS App Store 内购',
          source: '中文来源（与同区 Plus 条目交叉印证）',
          url: '', fetched: '2026-08-11', conf: '中',
          note: '与本区 Plus 的比值为 10.38 倍，接近官方价格比（$200 ÷ $20 = 10.0），差约 4% 可由 Apple 价格档位取整解释 —— 两条原本低置信的数据因此互相印证。仍建议做一手核验。'
        }
      }
    },
    {
      id: 'TR',
      name: '土耳其区',
      pending: false,
      prices: {
        plus: {
          usd: 14.00, local: '₺（未标注具体金额）', caliber: '未标注',
          source: 'aisubscriptioncomparison.com', url: '', fetched: '2026-09', conf: '低',
          note: '区间 $13–15。另有 2026-05 来源报 ¥80–102（≈$11–14），差异未解释。未标口径，无法判断是 Web 还是 iOS。'
        }
      }
    },
    {
      id: 'AR',
      name: '阿根廷区',
      pending: false,
      prices: {
        plus: {
          usd: 5.73, local: 'ARS（未标注具体金额）', caliber: '未标注（税费口径不明）',
          source: 'geopriced.com', url: '', fetched: '2026-09', conf: '低',
          note: '是否含税未知，未核验。历史上阿根廷区税费复杂，实际支付价可能显著高于标价。此条是「账面最优」，也是全表置信度最低的一条。'
        }
      }
    },
    {
      id: 'JP',
      name: '日本区',
      pending: true,
      prices: {}
    }
  ]
};
