import axios from "axios";

export async function searchStocks(query: string, market?: string) {
  if (!query || query.trim().length < 1) return [];

  const q = encodeURIComponent(query.trim());
  // Yahoo Finance 搜尋 API，可支援「蘋果」、「台積電」等中文，也支援 AAPL 等代號
  const yfUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${q}&quotesCount=20&newsCount=0`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yfUrl)}`;

  try {
    const res = await axios.get(proxyUrl);
    if (!res.data || !res.data.contents) return [];
    
    // allorigins /get 會將目標的 response body 包在 contents (字串) 裡
    const data = JSON.parse(res.data.contents);
    if (data.quotes && Array.isArray(data.quotes)) {
      return data.quotes
        .filter((q: any) => q.quoteType === "EQUITY" || q.quoteType === "ETF")
        .filter((q: any) => {
          if (market === "TW") {
            // 台股代號結尾通常為 .TW 或 .TWO
            return q.symbol.endsWith(".TW") || q.symbol.endsWith(".TWO") || q.exchange === "TAI" || q.exchange === "TWO";
          } else if (market === "US") {
            // 美股通常沒有包含點（.），排除其他國家後綴
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
  // 對於台股，例如 2330，要自動補上 .TW (若是 0050.TW 就不用)
  let formattedSymbol = symbol.trim().toUpperCase();
  if (/^\d{4}$/.test(formattedSymbol)) {
    formattedSymbol += ".TW";
  }

  const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}`;
  
  // 使用 AllOrigins /get 作為跨域代理
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(yfUrl)}`;

  try {
    const res = await axios.get(proxyUrl);
    if (!res.data || !res.data.contents) {
      console.warn(`[stockApi] Network response was empty for ${formattedSymbol}`);
      return null;
    }

    const data = JSON.parse(res.data.contents);
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
