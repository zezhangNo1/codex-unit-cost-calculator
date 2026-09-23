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
 *   本站抓取日 = 2026-09-23
 *   源站记录日 = 2026-06-05 ~ 2026-06-11（数据源记录的观测时点，不是我们抓取的那天）
 */
window.PRICING_DATA = {
  "meta": {
    "dataFetchedAt": "2026-09-23",
    "generatedAt": "2026-09-23",
    "srcObservedAt": "2026-06-11",
    "srcObservedRange": "2026-06-05 ~ 2026-06-11",
    "srcPage": "https://appstoreprice.org/zh/apps/6448311069",
    "caliber": "iOS App Store 内购（月付）",
    "currencyBasis": "CNY",
    "fx": {
      "cny": 6.7135,
      "fetched": "2026-09-23",
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
          "usd": 15.9,
          "cny": 106.74,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₱6,490",
          "currency": "PHP",
          "usd": 103.31,
          "cny": 693.57,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₱9,990",
          "currency": "PHP",
          "usd": 159.02,
          "cny": 1067.58,
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
          "cny": 118.56,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₨27,999",
          "currency": "PKR",
          "usd": 100.92,
          "cny": 677.53,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₨49,900",
          "currency": "PKR",
          "usd": 179.87,
          "cny": 1207.56,
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
          "usd": 17.82,
          "cny": 119.63,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "C$152.99",
          "currency": "CAD",
          "usd": 109.1,
          "cny": 732.44,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "C$249",
          "currency": "CAD",
          "usd": 177.57,
          "cny": 1192.12,
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
          "usd": 19.07,
          "cny": 128.03,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "JP¥16,800",
          "currency": "JPY",
          "usd": 106.77,
          "cny": 716.8,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "JP¥30,000",
          "currency": "JPY",
          "usd": 190.65,
          "cny": 1279.93,
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
          "usd": 19.21,
          "cny": 128.97,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₫2,849,000",
          "currency": "VND",
          "usd": 109.7,
          "cny": 736.47,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₫4,999,000",
          "currency": "VND",
          "usd": 192.49,
          "cny": 1292.28,
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
          "usd": 19.26,
          "cny": 129.3,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "E£5,399.99",
          "currency": "EGP",
          "usd": 103.99,
          "cny": 698.14,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "E£9,999.99",
          "currency": "EGP",
          "usd": 192.57,
          "cny": 1292.82,
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
          "usd": 19.47,
          "cny": 130.71,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R$524.90",
          "currency": "BRL",
          "usd": 102.3,
          "cny": 686.79,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R$999.90",
          "currency": "BRL",
          "usd": 194.87,
          "cny": 1308.26,
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
          "usd": 19.56,
          "cny": 131.32,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "Rp1,889,000",
          "currency": "IDR",
          "usd": 105.88,
          "cny": 710.83,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "Rp3,499,000",
          "currency": "IDR",
          "usd": 196.13,
          "cny": 1316.72,
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
          "cny": 134.2,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 671.35,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1342.7,
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
          "cny": 134.2,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "$100",
          "currency": "USD",
          "usd": 100,
          "cny": 671.35,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "$200",
          "currency": "USD",
          "usd": 200,
          "cny": 1342.7,
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
          "usd": 20.48,
          "cny": 137.49,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₺5,299.99",
          "currency": "TRY",
          "usd": 108.55,
          "cny": 728.75,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₺9,999.99",
          "currency": "TRY",
          "usd": 204.82,
          "cny": 1375.06,
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
          "usd": 20.83,
          "cny": 139.84,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CL$102,990",
          "currency": "CLP",
          "usd": 107.34,
          "cny": 720.63,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CL$199,990",
          "currency": "CLP",
          "usd": 208.44,
          "cny": 1399.36,
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
          "usd": 20.85,
          "cny": 139.98,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₹10,699",
          "currency": "INR",
          "usd": 111.6,
          "cny": 749.23,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₹19,900",
          "currency": "INR",
          "usd": 207.57,
          "cny": 1393.52,
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
          "usd": 21.02,
          "cny": 141.12,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "฿3,350",
          "currency": "THB",
          "usd": 100.73,
          "cny": 676.25,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "฿6,990",
          "currency": "THB",
          "usd": 210.18,
          "cny": 1411.04,
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
          "usd": 21.08,
          "cny": 141.52,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₩159,000",
          "currency": "KRW",
          "usd": 115.58,
          "cny": 775.95,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₩299,000",
          "currency": "KRW",
          "usd": 217.35,
          "cny": 1459.18,
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
          "usd": 21.36,
          "cny": 143.4,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "A$154.99",
          "currency": "AUD",
          "usd": 110.37,
          "cny": 740.97,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "A$300",
          "currency": "AUD",
          "usd": 213.62,
          "cny": 1434.14,
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
          "usd": 21.73,
          "cny": 145.88,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "NT$3,300",
          "currency": "TWD",
          "usd": 103.93,
          "cny": 697.73,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "NT$6,990",
          "currency": "TWD",
          "usd": 220.15,
          "cny": 1477.98,
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
          "cny": 146.22,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "د.إ384.99",
          "currency": "AED",
          "usd": 104.83,
          "cny": 703.78,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "د.إ799.99",
          "currency": "AED",
          "usd": 217.83,
          "cny": 1462.4,
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
          "usd": 22.31,
          "cny": 149.78,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₸54,990",
          "currency": "KZT",
          "usd": 122.83,
          "cny": 824.62,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₸99,990",
          "currency": "KZT",
          "usd": 223.34,
          "cny": 1499.39,
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
          "usd": 23.16,
          "cny": 155.48,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₪309.90",
          "currency": "ILS",
          "usd": 102.68,
          "cny": 689.34,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₪699.90",
          "currency": "ILS",
          "usd": 231.91,
          "cny": 1556.93,
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
          "usd": 23.18,
          "cny": 155.62,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "MX$1,989",
          "currency": "MXN",
          "usd": 115.54,
          "cny": 775.68,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "MX$3,999",
          "currency": "MXN",
          "usd": 232.3,
          "cny": 1559.55,
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
          "cny": 157.77,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "S$137.98",
          "currency": "SGD",
          "usd": 108.14,
          "cny": 726,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "S$299.98",
          "currency": "SGD",
          "usd": 235.1,
          "cny": 1578.34,
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
          "usd": 23.67,
          "cny": 158.91,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "₦144,900",
          "currency": "NGN",
          "usd": 108.89,
          "cny": 731.03,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "₦299,900",
          "currency": "NGN",
          "usd": 225.37,
          "cny": 1513.02,
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
          "cny": 161.12,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "ر.س429.99",
          "currency": "SAR",
          "usd": 114.66,
          "cny": 769.77,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "ر.س899.99",
          "currency": "SAR",
          "usd": 240,
          "cny": 1611.24,
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
          "usd": 24.35,
          "cny": 163.47,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CHF83",
          "currency": "CHF",
          "usd": 101.03,
          "cny": 678.26,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CHF200",
          "currency": "CHF",
          "usd": 243.45,
          "cny": 1634.4,
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
          "usd": 24.5,
          "cny": 164.48,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "RM419.90",
          "currency": "MYR",
          "usd": 102.99,
          "cny": 691.42,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "RM999.90",
          "currency": "MYR",
          "usd": 245.26,
          "cny": 1646.55,
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
          "usd": 24.62,
          "cny": 165.29,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "R1,839",
          "currency": "ZAR",
          "usd": 113.19,
          "cny": 759.9,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "R3,999.99",
          "currency": "ZAR",
          "usd": 246.19,
          "cny": 1652.8,
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
          "usd": 26.37,
          "cny": 177.03,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "€102.99",
          "currency": "EUR",
          "usd": 118.14,
          "cny": 793.13,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "€229",
          "currency": "EUR",
          "usd": 262.69,
          "cny": 1763.57,
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
          "usd": 26.39,
          "cny": 177.17,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr1,190",
          "currency": "NOK",
          "usd": 126.12,
          "cny": 846.71,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr2,490",
          "currency": "NOK",
          "usd": 263.91,
          "cny": 1771.76,
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
          "usd": 26.73,
          "cny": 179.45,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "£88.90",
          "currency": "GBP",
          "usd": 118.89,
          "cny": 798.17,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "£200",
          "currency": "GBP",
          "usd": 267.47,
          "cny": 1795.66,
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
          "usd": 27.48,
          "cny": 184.49,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "kr789",
          "currency": "DKK",
          "usd": 121.13,
          "cny": 813.21,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "kr1,799",
          "currency": "DKK",
          "usd": 276.19,
          "cny": 1854.2,
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
          "usd": 31.48,
          "cny": 211.34,
          "obs": "2026-06-11"
        },
        "pro5": {
          "local": "CO$364,900",
          "currency": "COP",
          "usd": 115,
          "cny": 772.05,
          "obs": "2026-06-05"
        },
        "pro20": {
          "local": "CO$999,900",
          "currency": "COP",
          "usd": 315.12,
          "cny": 2115.56,
          "obs": "2026-06-11"
        }
      }
    }
  ]
};
