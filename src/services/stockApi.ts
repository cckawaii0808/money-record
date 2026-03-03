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

export async function searchStocks(query: string, market?: string) {
  if (!query || query.trim().length < 1) return [];

  const q = encodeURIComponent(query.trim());
  // Yahoo Finance 搜尋 API
  const yfUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=20&newsCount=0`;

  try {
    const data = await fetchWithProxy(yfUrl);
    if (data.quotes && Array.isArray(data.quotes)) {
      return data.quotes
        .filter((q: any) => q.quoteType === "EQUITY" || q.quoteType === "ETF")
        .filter((q: any) => {
          if (market === "TW") {
            return q.symbol.endsWith(".TW") || q.symbol.endsWith(".TWO") || q.exchange === "TAI" || q.exchange === "TWO";
          } else if (market === "US") {
            return !q.symbol.includes(".");
          }
          return true;
        })
        .map((q: any) => ({
          symbol: q.symbol,
          name: q.shortname || q.longname || q.symbol,
          exch: q.exchDisp || q.exchange || ''
        }));
    }
    return [];
  } catch (error) {
    console.error("[stockApi] Search error:", error);
    return [];
  }
}

export async function fetchStockPrice(symbol: string): Promise<number | null> {
  let formattedSymbol = symbol.trim().toUpperCase();
  if (/^\d{4}$/.test(formattedSymbol)) {
    formattedSymbol += ".TW";
  }

  const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`;

  try {
    const data = await fetchWithProxy(yfUrl);
    const result = data?.chart?.result?.[0];
    
    if (result && result.meta && result.meta.regularMarketPrice) {
      return result.meta.regularMarketPrice;
    }
    
    return null;
  } catch (error) {
    console.error(`[stockApi] Error fetching price for ${formattedSymbol}:`, error);
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
