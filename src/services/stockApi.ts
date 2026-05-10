/**
 * 股票搜尋與報價服務。
 *
 * 架構說明：
 * - 台股搜尋：使用本地 tw_stocks.json（快速、不消耗 API quota）
 * - 美股搜尋：透過 Worker 代理 Finnhub（金鑰在後端，不暴露給瀏覽器）
 * - 所有股價取得：透過 Worker 代理（Fugle 台股 / Finnhub 美股）
 */

import { apiGet } from "./apiClient";
import twStocksData from "../data/tw_stocks.json";

// ============================================================================
// 型別定義
// ============================================================================

interface WorkerSearchResult {
  data: Array<{
    symbol: string;
    name: string;
    market: "TW" | "US";
    type: string;
  }>;
  meta: {
    query: string;
    market: string;
    count: number;
  };
  errors: string[];
}

interface WorkerSyncResult {
  data: Array<{
    symbol: string;
    market: "TW" | "US";
    price: number;
    updatedAt: number;
    source: string;
  }>;
  meta: {
    requestedCount: number;
    cacheHitCount: number;
    fetchedCount: number;
    ttlMs: number;
  };
  errors: string[];
}

// ============================================================================
// 股票搜尋
// ============================================================================

/**
 * 搜尋股票標的。
 *
 * - 台股：從本地 tw_stocks.json 過濾（快速、不消耗 API）
 * - 美股：呼叫 Worker API（Finnhub 金鑰在後端）
 *
 * @param query - 搜尋關鍵字（代碼或名稱）
 * @param market - 市場（"TW" | "US"），未指定時同時搜尋
 */
export async function searchStocks(query: string, market?: string) {
  if (!query || query.trim().length < 1) return [];

  const q = query.trim();

  // 美股：透過 Worker 搜尋
  if (market === "US") {
    try {
      const result = await apiGet<WorkerSearchResult>(
        `/api/stocks/search?q=${encodeURIComponent(q)}&market=US`
      );
      return result.data.map((item) => ({
        symbol: item.symbol,
        code: item.symbol,
        name: item.name,
        exch: "US"
      }));
    } catch (error) {
      console.error("[stockApi] Worker 美股搜尋失敗：", error);
      return [];
    }
  }

  // 台股：本地 JSON 過濾（最快，不需要 API）
  // tw_stocks.json 的欄位格式：{ Date, Code, Name }
  const lowerQ = q.toLowerCase();
  return (twStocksData as Array<{ Code: string; Name: string }>)
    .filter(
      (item) =>
        (item.Code && item.Code.toLowerCase().includes(lowerQ)) ||
        (item.Name && item.Name.toLowerCase().includes(lowerQ))
    )
    .slice(0, 30)
    .map((item) => ({
      symbol: item.Code,
      code: item.Code,
      name: item.Name,
      exch: "TW"
    }));
}

// ============================================================================
// 股價取得
// ============================================================================

/**
 * 取得單一股票的最新報價。
 *
 * 透過 Worker 代理，支援台股（Fugle）與美股（Finnhub）。
 * Worker 有 5 分鐘快取，不會每次都打外部 API。
 *
 * @param symbol - 股票代碼（支援多種格式：2330、TW:2330、NVDA、US:NVDA）
 */
export async function fetchStockPrice(symbol: string): Promise<number | null> {
  const prices = await fetchMultipleStockPrices([symbol]);
  return prices[symbol] ?? null;
}

/**
 * 批次取得多支股票的最新報價。
 *
 * 透過 Worker 的 /api/stocks/sync 端點，支援混合台股與美股。
 * Worker 有 5 分鐘快取，對相同標的不會重複打外部 API。
 *
 * @param symbols - 股票代碼陣列（支援多種格式混用）
 * @returns 以代碼為 key 的價格 Map（取得失敗的代碼不會出現在結果中）
 */
export async function fetchMultipleStockPrices(
  symbols: string[]
): Promise<Record<string, number>> {
  if (symbols.length === 0) return {};

  const symbolsParam = symbols.join(",");

  try {
    const result = await apiGet<WorkerSyncResult>(
      `/api/stocks/sync?symbols=${encodeURIComponent(symbolsParam)}`
    );

    const priceMap: Record<string, number> = {};
    for (const item of result.data) {
      // 回傳的 symbol 格式為原始代碼，嘗試用傳入的格式當 key
      priceMap[item.symbol] = item.price;

      // 同時用 market:symbol 格式當 key，方便上層使用
      priceMap[`${item.market}:${item.symbol}`] = item.price;
    }

    if (result.errors.length > 0) {
      console.warn("[stockApi] 部分股票取得失敗：", result.errors);
    }

    return priceMap;
  } catch (error) {
    console.error("[stockApi] Worker 報價取得失敗：", error);
    return {};
  }
}
