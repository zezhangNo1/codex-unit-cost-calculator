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
 *   本站抓取日 = 2026-09-29
 *   源站记录日 = 2026-06-05 ~ 2026-06-11（数据源记录的观测时点，不是我们抓取的那天）
 */
window.PRICING_DATA = {
  "meta": {
    "dataFetchedAt": "2026-09-29",
    "generatedAt": "2026-09-29",
    "srcObservedAt": "2026-06-11",
    "srcObservedRange": "2026-06-05 ~ 2026-06-11",
    "srcPage": "https://appstoreprice.org/zh/apps/6448311069",
    "caliber": "iOS App Store 内购（月付）",
    "currencyBasis": "CNY",
    "fx": {
      "cny": 6.7216,
      "fetched": "2026-09-29",
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
          "usd": 16,
          "cny": 107.55,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₱6,490",
          "currency": "PHP",
          "usd": 103.92,
          "cny": 698.51,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₱9,990",
          "currency": "PHP",
          "usd": 159.97,
          "cny": 1075.25,
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
          "usd": 17.66,
          "cny": 118.7,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "C$152.99",
          "currency": "CAD",
          "usd": 108.13,
          "cny": 726.81,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "C$249",
          "currency": "CAD",
          "usd": 175.99,
          "cny": 1182.93,
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
          "usd": 17.7,
          "cny": 118.97,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₨27,999",
          "currency": "PKR",
          "usd": 101.11,
          "cny": 679.62,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₨49,900",
          "currency": "PKR",
          "usd": 180.2,
          "cny": 1211.23,
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
          "usd": 19.05,
          "cny": 128.05,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "JP¥16,800",
          "currency": "JPY",
          "usd": 106.67,
          "cny": 716.99,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "JP¥30,000",
          "currency": "JPY",
          "usd": 190.49,
          "cny": 1280.4,
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
          "usd": 19.24,
          "cny": 129.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₫2,849,000",
          "currency": "VND",
          "usd": 109.84,
          "cny": 738.3,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₫4,999,000",
          "currency": "VND",
          "usd": 192.74,
          "cny": 1295.52,
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
          "usd": 19.25,
          "cny": 129.39,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R$524.90",
          "currency": "BRL",
          "usd": 101.15,
          "cny": 679.89,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R$999.90",
          "currency": "BRL",
          "usd": 192.68,
          "cny": 1295.12,
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
          "usd": 19.33,
          "cny": 129.93,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "E£5,399.99",
          "currency": "EGP",
          "usd": 104.36,
          "cny": 701.47,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "E£9,999.99",
          "currency": "EGP",
          "usd": 193.26,
          "cny": 1299.02,
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
          "usd": 19.47,
          "cny": 130.87,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "Rp1,889,000",
          "currency": "IDR",
          "usd": 105.41,
          "cny": 708.52,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "Rp3,499,000",
          "currency": "IDR",
          "usd": 195.25,
          "cny": 1312.39,
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
          "cny": 134.36,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 672.16,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1344.32,
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
          "cny": 134.36,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 672.16,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1344.32,
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
          "usd": 20.43,
          "cny": 137.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₺5,299.99",
          "currency": "TRY",
          "usd": 108.28,
          "cny": 727.81,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₺9,999.99",
          "currency": "TRY",
          "usd": 204.3,
          "cny": 1373.22,
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
          "usd": 20.77,
          "cny": 139.61,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CL$102,990",
          "currency": "CLP",
          "usd": 107.03,
          "cny": 719.41,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CL$199,990",
          "currency": "CLP",
          "usd": 207.83,
          "cny": 1396.95,
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
          "usd": 20.84,
          "cny": 140.08,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₹10,699",
          "currency": "INR",
          "usd": 111.53,
          "cny": 749.66,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₹19,900",
          "currency": "INR",
          "usd": 207.45,
          "cny": 1394.4,
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
          "usd": 20.92,
          "cny": 140.62,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "฿3,350",
          "currency": "THB",
          "usd": 100.25,
          "cny": 673.84,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "฿6,990",
          "currency": "THB",
          "usd": 209.18,
          "cny": 1406.02,
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
          "usd": 21.03,
          "cny": 141.36,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "A$154.99",
          "currency": "AUD",
          "usd": 108.7,
          "cny": 730.64,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "A$300",
          "currency": "AUD",
          "usd": 210.41,
          "cny": 1414.29,
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
          "usd": 21.39,
          "cny": 143.78,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₩159,000",
          "currency": "KRW",
          "usd": 117.25,
          "cny": 788.11,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₩299,000",
          "currency": "KRW",
          "usd": 220.49,
          "cny": 1482.05,
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
          "usd": 21.72,
          "cny": 145.99,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "NT$3,300",
          "currency": "TWD",
          "usd": 103.89,
          "cny": 698.31,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "NT$6,990",
          "currency": "TWD",
          "usd": 220.05,
          "cny": 1479.09,
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
          "cny": 704.63,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "د.إ799.99",
          "currency": "AED",
          "usd": 217.83,
          "cny": 1464.17,
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
          "usd": 22.5,
          "cny": 151.24,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "MX$1,989",
          "currency": "MXN",
          "usd": 112.15,
          "cny": 753.83,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "MX$3,999",
          "currency": "MXN",
          "usd": 225.48,
          "cny": 1515.59,
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
          "usd": 22.57,
          "cny": 151.71,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₸54,990",
          "currency": "KZT",
          "usd": 124.23,
          "cny": 835.02,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₸99,990",
          "currency": "KZT",
          "usd": 225.9,
          "cny": 1518.41,
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
          "usd": 22.95,
          "cny": 154.26,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₪309.90",
          "currency": "ILS",
          "usd": 101.75,
          "cny": 683.92,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₪699.90",
          "currency": "ILS",
          "usd": 229.81,
          "cny": 1544.69,
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
          "usd": 23.45,
          "cny": 157.62,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "S$137.98",
          "currency": "SGD",
          "usd": 107.95,
          "cny": 725.6,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "S$299.98",
          "currency": "SGD",
          "usd": 234.69,
          "cny": 1577.49,
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
          "usd": 23.73,
          "cny": 159.5,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₦144,900",
          "currency": "NGN",
          "usd": 109.17,
          "cny": 733.8,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₦299,900",
          "currency": "NGN",
          "usd": 225.95,
          "cny": 1518.75,
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
          "cny": 770.7,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "ر.س899.99",
          "currency": "SAR",
          "usd": 240,
          "cny": 1613.18,
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
          "usd": 24.12,
          "cny": 162.12,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CHF83",
          "currency": "CHF",
          "usd": 100.08,
          "cny": 672.7,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CHF200",
          "currency": "CHF",
          "usd": 241.16,
          "cny": 1620.98,
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
          "usd": 24.51,
          "cny": 164.75,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R1,839",
          "currency": "ZAR",
          "usd": 112.67,
          "cny": 757.32,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R3,999.99",
          "currency": "ZAR",
          "usd": 245.07,
          "cny": 1647.26,
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
          "usd": 24.52,
          "cny": 164.81,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "RM419.90",
          "currency": "MYR",
          "usd": 103.06,
          "cny": 692.73,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "RM999.90",
          "currency": "MYR",
          "usd": 245.41,
          "cny": 1649.55,
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
          "usd": 26.17,
          "cny": 175.9,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "€102.99",
          "currency": "EUR",
          "usd": 117.25,
          "cny": 788.11,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "€229",
          "currency": "EUR",
          "usd": 260.71,
          "cny": 1752.39,
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
          "usd": 26.17,
          "cny": 175.9,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr1,190",
          "currency": "NOK",
          "usd": 125.07,
          "cny": 840.67,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr2,490",
          "currency": "NOK",
          "usd": 261.7,
          "cny": 1759.04,
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
          "usd": 26.46,
          "cny": 177.85,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "£88.90",
          "currency": "GBP",
          "usd": 117.66,
          "cny": 790.86,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "£200",
          "currency": "GBP",
          "usd": 264.69,
          "cny": 1779.14,
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
          "usd": 27.29,
          "cny": 183.43,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr789",
          "currency": "DKK",
          "usd": 120.3,
          "cny": 808.61,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr1,799",
          "currency": "DKK",
          "usd": 274.29,
          "cny": 1843.67,
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
          "usd": 29.96,
          "cny": 201.38,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CO$364,900",
          "currency": "COP",
          "usd": 109.44,
          "cny": 735.61,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CO$999,900",
          "currency": "COP",
          "usd": 299.88,
          "cny": 2015.67,
          "obs": "2026-06-11"
        }
      }
    }
  ]
};
