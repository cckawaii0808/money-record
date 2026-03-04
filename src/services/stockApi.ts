import axios from "axios";
import { getProxyUrl, switchToNextProxy, PROXY_PROVIDERS } from "./proxyConfig";

/**
 * 封裝 axios 請求，支援 Proxy Fallback
 */
async function fetchWithProxy(targetUrl: string) {
  let lastError = null;
  // 嘗試所有可用的 Proxy
  for (let i = 0; i < PROXY_PROVIDERS.length; i++) {
    const proxyUrl = getProxyUrl(targetUrl, i);
    try {
      const res = await axios.get(proxyUrl, { timeout: 10000 });
      
      // 處理不同 Proxy 的回傳格式
      let data = res.data;
      
      // allorigins 格式特殊，資料在 contents 欄位
      if (data && typeof data === 'object' && 'contents' in data) {
        try {
          data = JSON.parse(data.contents);
        } catch (e) {
          // 如果解析失敗，跳過此代理
          continue;
        }
      }
      
      return data;
    } catch (error) {
      console.warn(`[Proxy] 代理 ${PROXY_PROVIDERS[i].name} 請求失敗:`, error);
      lastError = error;
    }
  }
  throw lastError || new Error("All proxies failed");
}

// Finnhub API Key 設定
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
export async function searchStocks(query: string, market?: string) {
  if (!query || query.trim().length < 1) return [];

  const q = encodeURIComponent(query.trim());

  // 1. 若為美股 (US)，改打 Finnhub API
  if (market === "US") {
    const finnhubUrl = `https://finnhub.io/api/v1/search?q=${q}&token=${FINNHUB_API_KEY}`;
    try {
      const res = await axios.get(finnhubUrl, { timeout: 10000 });
      if (res.data && res.data.result) {
        return res.data.result
          // Finnhub 回傳有 Common Stock, ETF, ETP 等，我們過濾掉無用的，避免出現太多奇怪的結果
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

  // 2. 若為台股 (TW) 或未指定，使用原本的 Yahoo Finance 架構 (走代理)
  const yfUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=20&newsCount=0`;

  try {
    const data = await fetchWithProxy(yfUrl);
    if (data.quotes && Array.isArray(data.quotes)) {
      return data.quotes
        .filter((q: any) => q.quoteType === "EQUITY" || q.quoteType === "ETF")
        .filter((q: any) => {
          if (market === "TW") {
            return q.symbol.endsWith(".TW") || q.symbol.endsWith(".TWO") || q.exchange === "TAI" || q.exchange === "TWO";
          }
          return true;
        })
        .map((q: any) => ({
          symbol: q.symbol,
          code: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          exch: q.exchDisp || q.exchange || ''
        }));
    }
    return [];
  } catch (error) {
    console.error("[stockApi] Yahoo Search error:", error);
    return [];
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

  // 2. 台股即時報價，走 Yahoo Finance 代理
  const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`;

  try {
    const data = await fetchWithProxy(yfUrl);
    const result = data?.chart?.result?.[0];
    
    if (result && result.meta && result.meta.regularMarketPrice) {
      return result.meta.regularMarketPrice;
    }
    
    return null;
  } catch (error) {
    console.error(`[stockApi] Yahoo error fetching price for ${formattedSymbol}:`, error);
    return null;
  }
}

/**
 * 批次取得多個股票的價格
 */
export async function fetchMultipleStockPrices(symbols: string[]): Promise<Record<string, number>> {
  const priceMap: Record<string, number> = {};
  
  // 避免併發過多被阻擋，這裡用簡單的 Promise.all
  const promises = symbols.map(async (sym) => {
    const price = await fetchStockPrice(sym);
    if (price !== null) {
      priceMap[sym] = price;
    }
  });

  await Promise.allSettled(promises);
  return priceMap;
}
