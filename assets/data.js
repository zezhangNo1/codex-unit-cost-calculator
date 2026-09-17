/*
 * Codex 全球价格 —— 数据源
 * ------------------------------------------------------------------
 * ⚠️ 本文件由 tools/build-data.mjs 生成，请勿手工编辑。
 *    要改数据口径改生成器，然后：node tools/build-data.mjs
 *    要更新价格：node tools/build-data.mjs --fetch
 *
 * 口径：iOS App Store 内购（月付）。
 * 汇率：全站唯一，USD → CNY 一律用 meta.fx.cny，不用来源自己的折算值。
 * 两个时间，别混：
 *   本站抓取日 = 2026-09-17
 *   源站记录日 = 2026-06-05 ~ 2026-06-11（数据源记录的观测时点，不是我们抓取的那天）
 */
window.PRICING_DATA = {
  "meta": {
    "dataFetchedAt": "2026-09-17",
    "generatedAt": "2026-09-17",
    "srcObservedAt": "2026-06-11",
    "srcObservedRange": "2026-06-05 ~ 2026-06-11",
    "srcPage": "https://appstoreprice.org/zh/apps/6448311069",
    "caliber": "iOS App Store 内购（月付）",
    "currencyBasis": "CNY",
    "fx": {
      "cny": 6.7223,
      "fetched": "2026-09-17",
      "source": "open.er-api.com（公开接口，免 Key）"
    },
    "plansNote": "倍率取自 OpenAI 官方定价页；官方从不公布每月绝对额度，故不换算 token。"
  },
  "app": {
    "storeId": "6448311069",
    "name": "ChatGPT",
    "developer": "OpenAI OpCo, LLC",
    "category": "效率",
    "platforms": [
      "iOS",
      "iPadOS"
    ],
    "storeUrl": "https://apps.apple.com/app/id6448311069"
  },
  "plans": [
    {
      "id": "plus",
      "name": "ChatGPT Plus",
      "short": "Plus",
      "usd": 20,
      "mult": 1
    },
    {
      "id": "pro5",
      "name": "ChatGPT Pro 5x",
      "short": "Pro 5x",
      "usd": 100,
      "mult": 5
    },
    {
      "id": "pro20",
      "name": "ChatGPT Pro 20x",
      "short": "Pro 20x",
      "usd": 200,
      "mult": 20
    }
  ],
  "regions": [
    {
      "id": "PH",
      "name": "菲律宾",
      "flag": "🇵🇭",
      "prices": {
        "plus": {
          "local": "₱999",
          "currency": "PHP",
          "usd": 15.89,
          "cny": 106.82,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₱6,490",
          "currency": "PHP",
          "usd": 103.23,
          "cny": 693.94,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₱9,990",
          "currency": "PHP",
          "usd": 158.9,
          "cny": 1068.17,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "PK",
      "name": "巴基斯坦",
      "flag": "🇵🇰",
      "prices": {
        "plus": {
          "local": "₨4,900",
          "currency": "PKR",
          "usd": 17.64,
          "cny": 118.58,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₨27,999",
          "currency": "PKR",
          "usd": 100.82,
          "cny": 677.74,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₨49,900",
          "currency": "PKR",
          "usd": 179.68,
          "cny": 1207.86,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "CA",
      "name": "加拿大",
      "flag": "🇨🇦",
      "prices": {
        "plus": {
          "local": "C$24.99",
          "currency": "CAD",
          "usd": 17.96,
          "cny": 120.73,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "C$152.99",
          "currency": "CAD",
          "usd": 109.96,
          "cny": 739.18,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "C$249",
          "currency": "CAD",
          "usd": 178.97,
          "cny": 1203.09,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "EG",
      "name": "埃及",
      "flag": "🇪🇬",
      "prices": {
        "plus": {
          "local": "E£999.99",
          "currency": "EGP",
          "usd": 19.21,
          "cny": 129.14,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "E£5,399.99",
          "currency": "EGP",
          "usd": 103.72,
          "cny": 697.24,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "E£9,999.99",
          "currency": "EGP",
          "usd": 192.07,
          "cny": 1291.15,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "VN",
      "name": "越南",
      "flag": "🇻🇳",
      "prices": {
        "plus": {
          "local": "₫499,000",
          "currency": "VND",
          "usd": 19.26,
          "cny": 129.47,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₫2,849,000",
          "currency": "VND",
          "usd": 109.98,
          "cny": 739.32,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₫4,999,000",
          "currency": "VND",
          "usd": 192.98,
          "cny": 1297.27,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "JP",
      "name": "日本",
      "flag": "🇯🇵",
      "prices": {
        "plus": {
          "local": "JP¥3,000",
          "currency": "JPY",
          "usd": 19.35,
          "cny": 130.08,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "JP¥16,800",
          "currency": "JPY",
          "usd": 108.33,
          "cny": 728.23,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "JP¥30,000",
          "currency": "JPY",
          "usd": 193.45,
          "cny": 1300.43,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "BR",
      "name": "巴西",
      "flag": "🇧🇷",
      "prices": {
        "plus": {
          "local": "R$99.90",
          "currency": "BRL",
          "usd": 19.4,
          "cny": 130.41,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R$524.90",
          "currency": "BRL",
          "usd": 101.92,
          "cny": 685.14,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R$999.90",
          "currency": "BRL",
          "usd": 194.15,
          "cny": 1305.13,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "ID",
      "name": "印尼",
      "flag": "🇮🇩",
      "prices": {
        "plus": {
          "local": "Rp349,000",
          "currency": "IDR",
          "usd": 19.73,
          "cny": 132.63,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "Rp1,889,000",
          "currency": "IDR",
          "usd": 106.79,
          "cny": 717.87,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "Rp3,499,000",
          "currency": "IDR",
          "usd": 197.82,
          "cny": 1329.81,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "AR",
      "name": "阿根廷",
      "flag": "🇦🇷",
      "prices": {
        "plus": {
          "local": "$19.99",
          "currency": "USD",
          "usd": 19.99,
          "cny": 134.38,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 672.23,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1344.46,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "US",
      "name": "美国",
      "flag": "🇺🇸",
      "prices": {
        "plus": {
          "local": "$19.99",
          "currency": "USD",
          "usd": 19.99,
          "cny": 134.38,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 672.23,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1344.46,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "TR",
      "name": "土耳其",
      "flag": "🇹🇷",
      "prices": {
        "plus": {
          "local": "₺999.99",
          "currency": "TRY",
          "usd": 20.55,
          "cny": 138.14,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₺5,299.99",
          "currency": "TRY",
          "usd": 108.91,
          "cny": 732.13,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₺9,999.99",
          "currency": "TRY",
          "usd": 205.49,
          "cny": 1381.37,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "IN",
      "name": "印度",
      "flag": "🇮🇳",
      "prices": {
        "plus": {
          "local": "₹1,999",
          "currency": "INR",
          "usd": 20.83,
          "cny": 140.03,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₹10,699",
          "currency": "INR",
          "usd": 111.46,
          "cny": 749.27,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₹19,900",
          "currency": "INR",
          "usd": 207.31,
          "cny": 1393.6,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "CL",
      "name": "智利",
      "flag": "🇨🇱",
      "prices": {
        "plus": {
          "local": "CL$19,990",
          "currency": "CLP",
          "usd": 20.88,
          "cny": 140.36,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CL$102,990",
          "currency": "CLP",
          "usd": 107.6,
          "cny": 723.32,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CL$199,990",
          "currency": "CLP",
          "usd": 208.94,
          "cny": 1404.56,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "TH",
      "name": "泰国",
      "flag": "🇹🇭",
      "prices": {
        "plus": {
          "local": "฿699",
          "currency": "THB",
          "usd": 20.99,
          "cny": 141.1,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "฿3,350",
          "currency": "THB",
          "usd": 100.62,
          "cny": 676.4,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "฿6,990",
          "currency": "THB",
          "usd": 209.95,
          "cny": 1411.35,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "KR",
      "name": "韩国",
      "flag": "🇰🇷",
      "prices": {
        "plus": {
          "local": "₩29,000",
          "currency": "KRW",
          "usd": 21.32,
          "cny": 143.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₩159,000",
          "currency": "KRW",
          "usd": 116.88,
          "cny": 785.7,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₩299,000",
          "currency": "KRW",
          "usd": 219.79,
          "cny": 1477.49,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "AU",
      "name": "澳大利亚",
      "flag": "🇦🇺",
      "prices": {
        "plus": {
          "local": "A$29.99",
          "currency": "AUD",
          "usd": 21.37,
          "cny": 143.66,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "A$154.99",
          "currency": "AUD",
          "usd": 110.46,
          "cny": 742.55,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "A$300",
          "currency": "AUD",
          "usd": 213.8,
          "cny": 1437.23,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "TW",
      "name": "中国台湾",
      "flag": "🇹🇼",
      "prices": {
        "plus": {
          "local": "NT$690",
          "currency": "TWD",
          "usd": 21.67,
          "cny": 145.67,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "NT$3,300",
          "currency": "TWD",
          "usd": 103.64,
          "cny": 696.7,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "NT$6,990",
          "currency": "TWD",
          "usd": 219.53,
          "cny": 1475.75,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "AE",
      "name": "阿联酋",
      "flag": "🇦🇪",
      "prices": {
        "plus": {
          "local": "د.إ79.99",
          "currency": "AED",
          "usd": 21.78,
          "cny": 146.41,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "د.إ384.99",
          "currency": "AED",
          "usd": 104.83,
          "cny": 704.7,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "د.إ799.99",
          "currency": "AED",
          "usd": 217.83,
          "cny": 1464.32,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "KZ",
      "name": "哈萨克斯坦",
      "flag": "🇰🇿",
      "prices": {
        "plus": {
          "local": "₸9,990",
          "currency": "KZT",
          "usd": 22.29,
          "cny": 149.84,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₸54,990",
          "currency": "KZT",
          "usd": 122.68,
          "cny": 824.69,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₸99,990",
          "currency": "KZT",
          "usd": 223.07,
          "cny": 1499.54,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "IL",
      "name": "以色列",
      "flag": "🇮🇱",
      "prices": {
        "plus": {
          "local": "₪69.90",
          "currency": "ILS",
          "usd": 22.99,
          "cny": 154.55,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₪309.90",
          "currency": "ILS",
          "usd": 101.91,
          "cny": 685.07,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₪699.90",
          "currency": "ILS",
          "usd": 230.17,
          "cny": 1547.27,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "MX",
      "name": "墨西哥",
      "flag": "🇲🇽",
      "prices": {
        "plus": {
          "local": "MX$399",
          "currency": "MXN",
          "usd": 23.25,
          "cny": 156.29,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "MX$1,989",
          "currency": "MXN",
          "usd": 115.92,
          "cny": 779.25,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "MX$3,999",
          "currency": "MXN",
          "usd": 233.07,
          "cny": 1566.77,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "SG",
      "name": "新加坡",
      "flag": "🇸🇬",
      "prices": {
        "plus": {
          "local": "S$29.98",
          "currency": "SGD",
          "usd": 23.56,
          "cny": 158.38,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "S$137.98",
          "currency": "SGD",
          "usd": 108.41,
          "cny": 728.76,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "S$299.98",
          "currency": "SGD",
          "usd": 235.7,
          "cny": 1584.45,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "NG",
      "name": "尼日利亚",
      "flag": "🇳🇬",
      "prices": {
        "plus": {
          "local": "₦31,500",
          "currency": "NGN",
          "usd": 23.7,
          "cny": 159.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₦144,900",
          "currency": "NGN",
          "usd": 109.04,
          "cny": 733,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₦299,900",
          "currency": "NGN",
          "usd": 225.68,
          "cny": 1517.09,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "SA",
      "name": "沙特阿拉伯",
      "flag": "🇸🇦",
      "prices": {
        "plus": {
          "local": "ر.س89.99",
          "currency": "SAR",
          "usd": 24,
          "cny": 161.34,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "ر.س429.99",
          "currency": "SAR",
          "usd": 114.66,
          "cny": 770.78,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "ر.س899.99",
          "currency": "SAR",
          "usd": 240,
          "cny": 1613.35,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "CH",
      "name": "瑞士",
      "flag": "🇨🇭",
      "prices": {
        "plus": {
          "local": "CHF20",
          "currency": "CHF",
          "usd": 24.42,
          "cny": 164.16,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CHF83",
          "currency": "CHF",
          "usd": 101.35,
          "cny": 681.31,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CHF200",
          "currency": "CHF",
          "usd": 244.21,
          "cny": 1641.65,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "MY",
      "name": "马来西亚",
      "flag": "🇲🇾",
      "prices": {
        "plus": {
          "local": "RM99.90",
          "currency": "MYR",
          "usd": 24.46,
          "cny": 164.43,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "RM419.90",
          "currency": "MYR",
          "usd": 102.8,
          "cny": 691.05,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "RM999.90",
          "currency": "MYR",
          "usd": 244.81,
          "cny": 1645.69,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "ZA",
      "name": "南非",
      "flag": "🇿🇦",
      "prices": {
        "plus": {
          "local": "R399.99",
          "currency": "ZAR",
          "usd": 24.59,
          "cny": 165.3,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R1,839",
          "currency": "ZAR",
          "usd": 113.06,
          "cny": 760.02,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R3,999.99",
          "currency": "ZAR",
          "usd": 245.92,
          "cny": 1653.15,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "DE",
      "name": "德国",
      "flag": "🇩🇪",
      "prices": {
        "plus": {
          "local": "€22.99",
          "currency": "EUR",
          "usd": 26.53,
          "cny": 178.34,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "€102.99",
          "currency": "EUR",
          "usd": 118.83,
          "cny": 798.81,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "€229",
          "currency": "EUR",
          "usd": 264.22,
          "cny": 1776.17,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "NO",
      "name": "挪威",
      "flag": "🇳🇴",
      "prices": {
        "plus": {
          "local": "kr249",
          "currency": "NOK",
          "usd": 26.64,
          "cny": 179.08,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr1,190",
          "currency": "NOK",
          "usd": 127.31,
          "cny": 855.82,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr2,490",
          "currency": "NOK",
          "usd": 266.39,
          "cny": 1790.75,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "GB",
      "name": "英国",
      "flag": "🇬🇧",
      "prices": {
        "plus": {
          "local": "£19.99",
          "currency": "GBP",
          "usd": 26.94,
          "cny": 181.1,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "£88.90",
          "currency": "GBP",
          "usd": 119.81,
          "cny": 805.4,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "£200",
          "currency": "GBP",
          "usd": 269.53,
          "cny": 1811.86,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "DK",
      "name": "丹麦",
      "flag": "🇩🇰",
      "prices": {
        "plus": {
          "local": "kr179",
          "currency": "DKK",
          "usd": 27.63,
          "cny": 185.74,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr789",
          "currency": "DKK",
          "usd": 121.79,
          "cny": 818.71,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr1,799",
          "currency": "DKK",
          "usd": 277.7,
          "cny": 1866.78,
          "obs": "2026-06-11"
        }
      }
    },
    {
      "id": "CO",
      "name": "哥伦比亚",
      "flag": "🇨🇴",
      "prices": {
        "plus": {
          "local": "CO$99,900",
          "currency": "COP",
          "usd": 32.18,
          "cny": 216.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CO$364,900",
          "currency": "COP",
          "usd": 117.56,
          "cny": 790.27,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CO$999,900",
          "currency": "COP",
          "usd": 322.13,
          "cny": 2165.45,
          "obs": "2026-06-11"
        }
      }
    }
  ]
};
