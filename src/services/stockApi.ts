import axios from "axios";
import twStocksData from "../data/tw_stocks.json";

// Finnhub API Key 設定
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export async function searchStocks(query: string, market?: string) {
  if (!query || query.trim().length < 1) return [];

  const q = query.trim();

  // 1. 若為美股 (US)，打 Finnhub API
  if (market === "US") {
    const finnhubUrl = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${FINNHUB_API_KEY}`;
    try {
      const res = await axios.get(finnhubUrl, { timeout: 10000 });
      if (res.data && res.data.result) {
        return res.data.result
          // Finnhub 回傳有 Common Stock, ETF, ETP 等，我們過濾掉無用的
          .filter((item: any) => !item.type || item.type === "Common Stock" || item.type.includes("ETF") || item.type.includes("ETP"))
          .map((item: any) => ({
            symbol: item.symbol,
            code: item.symbol,
            name: item.description,
            exch: item.type || "US"
          }));
      }
      return [];
    } catch (error) {
      console.error("[stockApi] Finnhub search error:", error);
      return [];
    }
  }

  // 2. 若為台股 (TW) 或未指定，全本地搜尋 tw_stocks.json (免 API 最穩定)
  const lowerQ = q.toLowerCase();
  
  // 從本地 JSON 直接過濾 (最多取 30 筆)
  const results = (twStocksData as any[])
    .filter(item => 
      (item.symbol && item.symbol.toLowerCase().includes(lowerQ)) || 
      (item.name && item.name.toLowerCase().includes(lowerQ))
    )
    .slice(0, 30)
    .map(item => ({
      symbol: item.symbol,
      code: item.symbol,
      name: item.name,
      exch: item.market || "TW"
    }));

  return results;
}

// --- 台灣股市 Open API 快取機制 ---
let twseCache: Record<string, number> | null = null;
let twseCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1小時快取

async function getTwseData(): Promise<Record<string, number>> {
  if (twseCache && Date.now() - twseCacheTime < CACHE_TTL) {
    return twseCache;
  }

  const priceMap: Record<string, number> = {};
  try {
    // 1. 取得證交所 (上市) 每日收盤行情
    let twseData = null;
    try {
      // 透過 allorigins 代理解決 CORS
      const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL');
      const twseRes = await axios.get(proxyUrl, { timeout: 10000 });
      twseData = JSON.parse(twseRes.data.contents);
    } catch (err) {
      console.warn("TWSE 抓取失敗：", err);
    }

    if (Array.isArray(twseData)) {
      twseData.forEach((item: any) => {
        if (item.Code && item.ClosingPrice) {
          const price = parseFloat(item.ClosingPrice);
          if (!isNaN(price)) {
            priceMap[`${item.Code}.TW`] = price;
          }
        }
      });
    }

    // 2. 取得櫃買中心 (上櫃) 每日收盤行情
    let tpexData = null;
    try {
      // 同樣透過 allorigins 代理解決 CORS
      const tpexProxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes');
      const tpexRes = await axios.get(tpexProxyUrl, { timeout: 10000 });
      tpexData = JSON.parse(tpexRes.data.contents);
    } catch (err) {
      console.warn("TPEx 抓取失敗：", err);
    }

    if (Array.isArray(tpexData)) {
      tpexData.forEach((item: any) => {
        if (item.SecuritiesCompanyCode && item.Close) {
          const price = parseFloat(item.Close);
          if (!isNaN(price)) {
            priceMap[`${item.SecuritiesCompanyCode}.TWO`] = price;
          }
        }
      });
    }

    twseCache = priceMap;
    twseCacheTime = Date.now();
    return priceMap;
  } catch (error) {
    console.error("[stockApi] 取得台股 Open API 失敗:", error);
    if (twseCache) return twseCache;
    return {};
  }
}

export async function fetchStockPrice(symbol: string): Promise<number | null> {
  let formattedSymbol = symbol.trim().toUpperCase();
  
  // 台股自動補上 .TW
  const isTaiwan = /^\d{4}$/.test(formattedSymbol) || formattedSymbol.endsWith(".TW") || formattedSymbol.endsWith(".TWO");
  if (/^\d{4}$/.test(formattedSymbol)) {
    formattedSymbol += ".TW";
  }

  // 1. 美股即時報價，走 Finnhub API (判斷依據: 沒有點號或是我們明確知道是美股)
  if (!isTaiwan && !formattedSymbol.includes(".")) {
    const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=${formattedSymbol}&token=${FINNHUB_API_KEY}`;
    try {
      const res = await axios.get(finnhubUrl, { timeout: 10000 });
      // Finnhub quote: c is current price
      if (res.data && res.data.c !== undefined && res.data.c !== 0) {
        return res.data.c;
      }
      return null;
    } catch (error) {
      console.error(`[stockApi] Finnhub error fetching price for ${formattedSymbol}:`, error);
      return null;
    }
  }

  // 2. 台股即時報價，走 Open API
  try {
    const twseData = await getTwseData();
    if (twseData[formattedSymbol] !== undefined) {
      return twseData[formattedSymbol];
    }
    
    // 如果找不到，試試切換 .TW / .TWO 後綴互找
    const altSymbol = formattedSymbol.endsWith(".TW") 
      ? formattedSymbol.replace(".TW", ".TWO") 
      : formattedSymbol.replace(".TWO", ".TW");
      
    if (twseData[altSymbol] !== undefined) {
      return twseData[altSymbol];
    }
    
    return null;
  } catch (error) {
    console.error(`[stockApi] TWSE error fetching price for ${formattedSymbol}:`, error);
    return null;
  }
}

/**
 * 批次取得多個股票的價格
 */
export async function fetchMultipleStockPrices(symbols: string[]): Promise<Record<string, number>> {
  const priceMap: Record<string, number> = {};
  
  // 先嘗試拉一次台股資料 (確保快取準備好，可以加速)
  const hasTaiwanStocks = symbols.some(s => /^\d{4}$/.test(s) || s.endsWith(".TW") || s.endsWith(".TWO"));
  if (hasTaiwanStocks) {
    await getTwseData();
  }
  
  // 避免併發過多被阻擋
  const promises = symbols.map(async (sym) => {
    const price = await fetchStockPrice(sym);
    if (price !== null) {
      priceMap[sym] = price;
    }
  });

  await Promise.allSettled(promises);
  return priceMap;
}
