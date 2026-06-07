/**
 * stockListSync.ts
 *
 * 台股清單資料流：
 *   1. 模組載入時立即從 tw_stocks.json 同步初始化記憶體快取（零延遲）
 *   2. initStockCache() 僅回傳目前快取狀態，不再讀取 Firestore
 *
 * Mock 資料來源：src/data/tw_stocks.json
 *   原始資料來自臺灣證券交易所 OpenAPI：
 *   GET https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL
 *
 * 更新 JSON 指令（PowerShell）：
 *   Invoke-WebRequest `
 *     -Uri "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL" `
 *     -Headers @{"Accept"="application/json"} `
 *     -OutFile "src/data/tw_stocks.json"
 */

import rawStocks from "../data/tw_stocks.json";

// ── 型別 ──────────────────────────────────────────────────────────────────

export interface StockRecord {
  symbol: string; // Yahoo Finance 格式代號，如 2330.TW
  code: string;   // 純代號，如 2330
  name: string;   // 中文名稱，如 台積電
  market: string; // TW
  exch: string;   // TAI（上市）
}

interface TwseStockAvgItem {
  Date: string;
  Code: string;
  Name: string;
}

// ── Mock 資料解析 ─────────────────────────────────────────────────────────

/**
 * 解析 tw_stocks.json，僅保留純數字代號、長度 4–6 碼（股票 + ETF，排除權證）
 */
function parseMockStocks(): StockRecord[] {
  const items = rawStocks as TwseStockAvgItem[];
  const results: StockRecord[] = [];

  for (const item of items) {
    const code = (item.Code ?? "").trim();
    const name = (item.Name ?? "").trim();
    if (!code || !name) continue;
    // 允許純數字 4–6 碼（股票 / ETF），或數字 + 尾端 L/R 共 5–7 碼（槓桿/反向 ETF，如 00631L）
    // 排除權證（P/C/W 等後綴，或超長代號）
    if (!/^\d{4,6}[LR]?$/.test(code)) continue;

    results.push({
      symbol: `${code}.TW`,
      code,
      name,
      market: "TW",
      exch: "TAI",
    });
  }

  return results;
}

// ── 記憶體快取（模組載入時同步初始化） ───────────────────────────────────

/**
 * 目前使用中的股票清單。
 * 模組載入時立即用 JSON mock 資料填充，搜尋功能無需等待任何 async 操作。
 * 不再從 Firebase Firestore 載入資料，避免非認證資料來源造成權限錯誤。
 */
let _activeStocks: StockRecord[] = parseMockStocks();

console.log(`[stockListSync] 初始化完成（mock JSON）：${_activeStocks.length} 筆`);

/** 取得目前記憶體中的股票清單 */
export function getActiveStocks(): StockRecord[] {
  return _activeStocks;
}

// ── 快取初始化狀態 ───────────────────────────────────────────────────────

/**
 * 回傳目前台股清單快取狀態。
 *
 * 說明：
 * - 台股清單已在模組載入時由 JSON 初始化。
 * - 此函式保留 async 介面，避免呼叫端需要調整。
 */
export async function initStockCache(): Promise<{ source: "mock"; count: number }> {
  return { source: "mock", count: _activeStocks.length };
}
