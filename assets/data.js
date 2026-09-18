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
 *   本站抓取日 = 2026-09-18
 *   源站记录日 = 2026-06-05 ~ 2026-06-11（数据源记录的观测时点，不是我们抓取的那天）
 */
window.PRICING_DATA = {
  "meta": {
    "dataFetchedAt": "2026-09-18",
    "generatedAt": "2026-09-18",
    "srcObservedAt": "2026-06-11",
    "srcObservedRange": "2026-06-05 ~ 2026-06-11",
    "srcPage": "https://appstoreprice.org/zh/apps/6448311069",
    "caliber": "iOS App Store 内购（月付）",
    "currencyBasis": "CNY",
    "fx": {
      "cny": 6.7218,
      "fetched": "2026-09-18",
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
          "usd": 15.91,
          "cny": 106.94,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₱6,490",
          "currency": "PHP",
          "usd": 103.35,
          "cny": 694.7,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₱9,990",
          "currency": "PHP",
          "usd": 159.09,
          "cny": 1069.37,
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
          "usd": 17.66,
          "cny": 118.71,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₨27,999",
          "currency": "PKR",
          "usd": 100.89,
          "cny": 678.16,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₨49,900",
          "currency": "PKR",
          "usd": 179.81,
          "cny": 1208.65,
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
          "usd": 17.91,
          "cny": 120.39,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "C$152.99",
          "currency": "CAD",
          "usd": 109.62,
          "cny": 736.84,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "C$249",
          "currency": "CAD",
          "usd": 178.42,
          "cny": 1199.3,
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
          "usd": 19.16,
          "cny": 128.79,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "E£5,399.99",
          "currency": "EGP",
          "usd": 103.47,
          "cny": 695.5,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "E£9,999.99",
          "currency": "EGP",
          "usd": 191.61,
          "cny": 1287.96,
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
          "usd": 19.22,
          "cny": 129.19,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₫2,849,000",
          "currency": "VND",
          "usd": 109.74,
          "cny": 737.65,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₫4,999,000",
          "currency": "VND",
          "usd": 192.56,
          "cny": 1294.35,
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
          "usd": 19.28,
          "cny": 129.6,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "JP¥16,800",
          "currency": "JPY",
          "usd": 107.98,
          "cny": 725.82,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "JP¥30,000",
          "currency": "JPY",
          "usd": 192.83,
          "cny": 1296.16,
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
          "cny": 130.4,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R$524.90",
          "currency": "BRL",
          "usd": 101.91,
          "cny": 685.02,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R$999.90",
          "currency": "BRL",
          "usd": 194.13,
          "cny": 1304.9,
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
          "usd": 19.72,
          "cny": 132.55,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "Rp1,889,000",
          "currency": "IDR",
          "usd": 106.72,
          "cny": 717.35,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "Rp3,499,000",
          "currency": "IDR",
          "usd": 197.69,
          "cny": 1328.83,
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
          "cny": 134.37,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 672.18,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1344.36,
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
          "cny": 134.37,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 672.18,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1344.36,
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
          "usd": 20.54,
          "cny": 138.07,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₺5,299.99",
          "currency": "TRY",
          "usd": 108.86,
          "cny": 731.74,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₺9,999.99",
          "currency": "TRY",
          "usd": 205.4,
          "cny": 1380.66,
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
          "usd": 20.82,
          "cny": 139.95,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₹10,699",
          "currency": "INR",
          "usd": 111.42,
          "cny": 748.94,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₹19,900",
          "currency": "INR",
          "usd": 207.25,
          "cny": 1393.09,
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
          "usd": 20.92,
          "cny": 140.62,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CL$102,990",
          "currency": "CLP",
          "usd": 107.76,
          "cny": 724.34,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CL$199,990",
          "currency": "CLP",
          "usd": 209.25,
          "cny": 1406.54,
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
          "cny": 141.09,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "฿3,350",
          "currency": "THB",
          "usd": 100.6,
          "cny": 676.21,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "฿6,990",
          "currency": "THB",
          "usd": 209.91,
          "cny": 1410.97,
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
          "usd": 21.17,
          "cny": 142.3,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₩159,000",
          "currency": "KRW",
          "usd": 116.07,
          "cny": 780.2,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₩299,000",
          "currency": "KRW",
          "usd": 218.28,
          "cny": 1467.23,
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
          "usd": 21.32,
          "cny": 143.31,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "A$154.99",
          "currency": "AUD",
          "usd": 110.2,
          "cny": 740.74,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "A$300",
          "currency": "AUD",
          "usd": 213.3,
          "cny": 1433.76,
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
          "cny": 145.66,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "NT$3,300",
          "currency": "TWD",
          "usd": 103.64,
          "cny": 696.65,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "NT$6,990",
          "currency": "TWD",
          "usd": 219.53,
          "cny": 1475.64,
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
          "cny": 146.4,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "د.إ384.99",
          "currency": "AED",
          "usd": 104.83,
          "cny": 704.65,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "د.إ799.99",
          "currency": "AED",
          "usd": 217.83,
          "cny": 1464.21,
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
          "usd": 22.38,
          "cny": 150.43,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₸54,990",
          "currency": "KZT",
          "usd": 123.18,
          "cny": 827.99,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₸99,990",
          "currency": "KZT",
          "usd": 223.98,
          "cny": 1505.55,
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
          "usd": 23,
          "cny": 154.6,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₪309.90",
          "currency": "ILS",
          "usd": 101.95,
          "cny": 685.29,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₪699.90",
          "currency": "ILS",
          "usd": 230.25,
          "cny": 1547.69,
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
          "usd": 23.21,
          "cny": 156.01,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "MX$1,989",
          "currency": "MXN",
          "usd": 115.69,
          "cny": 777.65,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "MX$3,999",
          "currency": "MXN",
          "usd": 232.6,
          "cny": 1563.49,
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
          "usd": 23.5,
          "cny": 157.96,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "S$137.98",
          "currency": "SGD",
          "usd": 108.18,
          "cny": 727.16,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "S$299.98",
          "currency": "SGD",
          "usd": 235.18,
          "cny": 1580.83,
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
          "usd": 23.72,
          "cny": 159.44,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₦144,900",
          "currency": "NGN",
          "usd": 109.12,
          "cny": 733.48,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₦299,900",
          "currency": "NGN",
          "usd": 225.85,
          "cny": 1518.12,
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
          "cny": 161.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "ر.س429.99",
          "currency": "SAR",
          "usd": 114.66,
          "cny": 770.72,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "ر.س899.99",
          "currency": "SAR",
          "usd": 240,
          "cny": 1613.23,
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
          "usd": 24.31,
          "cny": 163.41,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CHF83",
          "currency": "CHF",
          "usd": 100.9,
          "cny": 678.23,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CHF200",
          "currency": "CHF",
          "usd": 243.14,
          "cny": 1634.34,
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
          "usd": 24.44,
          "cny": 164.28,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "RM419.90",
          "currency": "MYR",
          "usd": 102.74,
          "cny": 690.6,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "RM999.90",
          "currency": "MYR",
          "usd": 244.66,
          "cny": 1644.56,
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
          "usd": 24.5,
          "cny": 164.68,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R1,839",
          "currency": "ZAR",
          "usd": 112.66,
          "cny": 757.28,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R3,999.99",
          "currency": "ZAR",
          "usd": 245.03,
          "cny": 1647.04,
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
          "usd": 26.45,
          "cny": 177.79,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "€102.99",
          "currency": "EUR",
          "usd": 118.48,
          "cny": 796.4,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "€229",
          "currency": "EUR",
          "usd": 263.43,
          "cny": 1770.72,
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
          "usd": 26.53,
          "cny": 178.33,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr1,190",
          "currency": "NOK",
          "usd": 126.77,
          "cny": 852.12,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr2,490",
          "currency": "NOK",
          "usd": 265.25,
          "cny": 1782.96,
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
          "usd": 26.83,
          "cny": 180.35,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "£88.90",
          "currency": "GBP",
          "usd": 119.34,
          "cny": 802.18,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "£200",
          "currency": "GBP",
          "usd": 268.48,
          "cny": 1804.67,
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
          "cny": 185.72,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr789",
          "currency": "DKK",
          "usd": 121.79,
          "cny": 818.65,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr1,799",
          "currency": "DKK",
          "usd": 277.69,
          "cny": 1866.58,
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
          "usd": 32.08,
          "cny": 215.64,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CO$364,900",
          "currency": "COP",
          "usd": 117.18,
          "cny": 787.66,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CO$999,900",
          "currency": "COP",
          "usd": 321.1,
          "cny": 2158.37,
          "obs": "2026-06-11"
        }
      }
    }
  ]
};
