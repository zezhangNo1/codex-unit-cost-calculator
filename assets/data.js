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

    /* 本批次地区价格的「观测日期」。这不是我们抓取他的日期，而是数据源自己记录的观测日。
       聚合站（appstoreprice.org）的数据观测于 2026-06-11，距本站更新已约 3 个月。
       这是本站当前最大的失真风险，必须对用户明示，不得当作实时价。 */
    dataBatchObservedAt: '2026-06-11',
    dataBatchSource: 'appstoreprice.org（App Store 官方页面 RSC 载荷解析）',
    dataBatchStaleness: '约 3 个月（观测日 2026-06-11）',

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
      short: '美区',
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
      short: '菲律宾',
      pending: false,
      prices: {
        plus: {
          usd: 15.89, cny: 106.89, local: '₱999 PHP', caliber: 'iOS App Store 内购',
          source: 'App Store 菲律宾区（经 appstoreprice.org 聚合核对）',
          url: 'https://apps.apple.com/ph/app/id6448311069',
          fetched: '2026-06-11', conf: '中',
          note: '32 区实测排名第 1（¥106.79），是本轮唯一确认的全球最低区。此前流传的三个数字差异已定位：¥109.82 ≈ 本条目（iOS 内购）；geopriced 报 $9.76 疑为 Web 或未含税口径；itscheaper.in 报 ₱1,200 疑为含税或另一时点。三者为口径差异，不是互相证伪。'
        },
        pro20: {
          usd: 164.93, cny: 1109.41, local: '¥1,109.41', caliber: 'iOS App Store 内购',
          source: '中文来源（与同区 Plus 条目交叉印证）',
          url: '', fetched: '2026-08-11', conf: '中',
          note: '来源直接以人民币标注，无本币原价。与本区 Plus 的比值为 10.38 倍，接近官方价格比（$200 ÷ $20 = 10.0），差约 4% 可由 Apple 价格档位取整解释 —— 两条原本低置信的数据因此互相印证。仍建议做一手核验。'
        }
      }
    },
    {
      id: 'TR',
      name: '土耳其区',
      short: '土耳其',
      pending: false,
      prices: {
        plus: {
          usd: 20.56, cny: 138.27, local: '₺999,99', caliber: 'iOS App Store 内购',
          source: 'App Store 土耳其区（经 appstoreprice.org 聚合核对）',
          url: 'https://apps.apple.com/tr/app/id6448311069',
          fetched: '2026-06-11', conf: '中',
          note: 'iOS 内购口径，32 区中排第 11 位（¥138.27），并非低价区。此前录得的 $14 来自未标口径的二手来源，违反本站「缺口径不收录」原则，已废弃。'
        }
      }
    },
    {
      id: 'AR',
      name: '阿根廷区',
      short: '阿根廷',
      pending: false,
      prices: {
        plus: {
          usd: 19.99, cny: 134.44, local: 'USD 19.99', caliber: 'iOS App Store 内购',
          source: 'App Store 阿根廷区（经 appstoreprice.org 聚合核对）',
          url: 'https://apps.apple.com/ar/app/id6448311069',
          fetched: '2026-06-11', conf: '中',
          note: '阿根廷区直接以美元标价（USD 19.99），与美区同价，32 区中并列第 9 —— 它不是低价区。此前录得的 $5.73 来自未标口径的 geopriced.com，属严重失真，违反本站「缺口径不收录」原则，已废弃。'
        }
      }
    },
    {
      id: 'JP',
      name: '日本区',
      short: '日本',
      pending: true,
      prices: {}
    }
  ]
};
