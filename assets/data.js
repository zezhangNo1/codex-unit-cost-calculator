/*
 * Codex 单位成本计算器 —— 数据源（唯一数据源，手工维护）
 * ------------------------------------------------------------------
 * 维护方式：直接改这个文件，然后 git commit + push，站点自动更新。
 * 不需要数据库、不需要后台。理由见 README.md「为什么不用数据库」。
 *
 * 字段说明：
 *   usd      折美元金额，用于计算的取值（有区间时取中位口径）
 *   local    本币标价原文
 *   caliber  价格口径：Web / iOS App Store / Google Play / 未标注
 *   source   来源名称
 *   url      来源链接
 *   fetched  抓取日期 YYYY-MM-DD
 *   conf     置信度：高 / 中 / 低
 *   note     口径冲突或其他必须告知用户的说明
 *
 * 铁律：抓不到就留空（不写进 regions[].prices），不要用推算价填坑。
 */

window.PRICING_DATA = {
  meta: {
    updatedAt: '2026-09-15',
    officialPricingUrl: 'https://developers.openai.com/codex/pricing',
    officialLimitsUrl: 'https://www.chatgpt.com/codex/pricing',
    weeksPerMonth: 4.33,
    defaultResetsPerMonth: 7.3,
    defaultResetUptake: 0.5,
    resetIntervalBasis: '各追踪站中位间隔 4.1 天（30 ÷ 4.1 ≈ 7.3）'
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
          fetched: '2026-09-15', conf: '高', note: ''
        },
        pro5: {
          usd: 100, local: '$100.00', caliber: 'Web 官方标价',
          source: 'OpenAI 官方定价页',
          url: 'https://developers.openai.com/codex/pricing',
          fetched: '2026-09-15', conf: '高', note: ''
        },
        pro20: {
          usd: 200, local: '$200.00', caliber: 'Web 官方标价',
          source: 'OpenAI 官方定价页',
          url: 'https://developers.openai.com/codex/pricing',
          fetched: '2026-09-15', conf: '高', note: ''
        }
      }
    },
    {
      id: 'PH',
      name: '菲律宾区',
      pending: false,
      prices: {
        plus: {
          usd: 15.40, local: '¥109.82 / ₱1,200', caliber: 'iOS App Store（多来源冲突）',
          source: '中文公众号 / itscheaper.in / geopriced.com',
          url: '', fetched: '2026-08-11', conf: '低',
          note: '三个来源相差近 2 倍：geopriced 报 $9.76 ｜ 中文公众号报 ¥109.82（≈$15.40）｜ itscheaper.in 报 ₱1,200（≈$19.10）。此处取中位口径，不构成事实，需一手核验。'
        },
        pro20: {
          usd: 155.40, local: '¥1,109.41', caliber: 'iOS App Store',
          source: '中文来源', url: '', fetched: '2026-08-11', conf: '中', note: ''
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
          note: '区间 $13–15。另有 2026-05 来源报 ¥80–102（≈$11–14），差异未解释。'
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
          note: '是否含税未知，未核验。历史上阿根廷区税费复杂，实际支付价可能显著高于标价。'
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
