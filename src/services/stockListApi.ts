/**
 * stockListApi.ts
 *
 * 台股搜尋：從記憶體快取（getActiveStocks）做客戶端模糊過濾。
 * 快取來源由 stockListSync 模組載入時同步初始化（tw_stocks.json），
 * 或 initStockCache() 升級為 Supabase 資料後替換。
 */

import { getActiveStocks } from "./stockListSync";

export interface StockListItem {
  symbol: string;
  code: string;
  name: string;
  market: string;
  exch: string;
}

/**
 * 搜尋台股（優先記憶體快取，fallback Yahoo Finance）
 *
 * @param query  使用者輸入（支援代號 / 中文名稱）
 * @param market 市場篩選，預設 "TW"
 * @param limit  最多回傳筆數，預設 15
 */
export function searchStocksFromCache(
  query: string,
  market = "TW",
  limit = 15
): StockListItem[] {
  if (!query || query.trim().length === 0) return [];

  const q = query.trim().toLowerCase();
  const cache = getActiveStocks();

  return cache
    .filter((item) => item.market === market)
    .filter((item) => {
      const symbolLower = item.symbol.toLowerCase();
      const nameLower = item.name.toLowerCase();
      const codeOnly = item.code.toLowerCase();
      return (
        symbolLower.includes(q) ||
        codeOnly.includes(q) ||
        nameLower.includes(q)
      );
    })
    .sort((a, b) => {
      const aCode = a.code.toLowerCase();
      const bCode = b.code.toLowerCase();
      // Exact code match gets highest priority
      if (aCode === q && bCode !== q) return -1;
      if (bCode === q && aCode !== q) return 1;
      // StarsWith code match gets second priority
      const aStartsWith = aCode.startsWith(q);
      const bStartsWith = bCode.startsWith(q);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      // Default to sorting alphabetically by code if both or neither are prefix matches
      return aCode.localeCompare(bCode);
    })
    .slice(0, limit);
}

/** 確認記憶體快取是否已就緒 */
export function checkStockCacheReady(): boolean {
  return getActiveStocks().length > 0;
}
