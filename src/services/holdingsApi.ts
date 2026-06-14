/**
 * 投資持倉 API 服務。
 *
 * 說明：
 * - 負責與 Worker 的 /api/holdings 端點互動。
 * - 包含取得、新增、更新、刪除持倉功能，以及每日快照。
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "./apiClient";
import type { Holding, InvestmentSnapshotPoint } from "../types";

// ============================================================================
// 型別定義
// ============================================================================

/**
 * Worker API 回傳的持倉項目。
 * 與 types.ts 的 Holding 介面一致。
 */
export interface HoldingApiItem {
  id: number;
  symbol: string;
  market: "TW" | "US";
  name: string;
  quantity: number;
  avgCost: number;
  currency: string;
  currentPrice: number | null;
  marketValue: number;
  gainLoss: number;
  gainLossPct: number | null;
  updatedAt: string;
}

/**
 * 取得持倉列表的回應格式。
 */
export interface HoldingsResponse {
  message: string;
  data: HoldingApiItem[];
  errors?: string[];
}

/**
 * 單一持倉項目的回應格式。
 */
export interface SingleHoldingResponse {
  message: string;
  data: HoldingApiItem;
}

/**
 * 快照觸發回應格式。
 */
export interface SnapshotResponse {
  message: string;
  data: {
    date: string;
    snapshotCount: number;
  };
}

/**
 * 快照資料點。
 */
export interface SnapshotDataPoint {
  date: string;
  capturedAt?: string;
  twValue: number;
  usValue: number;
  twCost: number;
  usCost: number;
  totalValue: number;
  totalCost: number;
  holdings: Array<{
    symbol: string;
    market: "TW" | "US";
    name: string;
    quantity: number;
    price: number;
    marketValue: number;
    avgCost: number;
  }>;
}

/**
 * 快照列表回應格式。
 */
export interface SnapshotsResponse {
  message: string;
  data: SnapshotDataPoint[];
}

// ============================================================================
// API 函式
// ============================================================================

/**
 * 取得目前使用者的持倉列表。
 * Worker 會自動同步最新股價，不需另外呼叫報價 API。
 */
export async function getHoldings(): Promise<HoldingApiItem[]> {
  const res = await apiGet<HoldingsResponse>("/api/holdings");
  return res.data;
}

/**
 * 新增一筆持倉。
 */
export async function createHolding(data: {
  symbol: string;
  market: "TW" | "US";
  name: string;
  quantity: number;
  avg_cost: number;
  currency: string;
}): Promise<HoldingApiItem> {
  const res = await apiPost<SingleHoldingResponse>("/api/holdings", data);
  return res.data;
}

/**
 * 更新持倉資料。
 */
export async function updateHolding(
  id: number,
  data: {
    quantity?: number;
    avg_cost?: number;
  }
): Promise<HoldingApiItem> {
  const res = await apiPatch<SingleHoldingResponse>(`/api/holdings/${id}`, data);
  return res.data;
}

/**
 * 刪除持倉，回傳更新後的列表。
 */
export async function deleteHolding(id: number): Promise<HoldingApiItem[]> {
  const res = await apiDelete<HoldingsResponse>(`/api/holdings/${id}`);
  return res.data;
}

/**
 * 觸發今日快照（同步股價後記錄當日市值）。
 */
export async function takeSnapshot(): Promise<SnapshotResponse["data"]> {
  const res = await apiPost<SnapshotResponse>("/api/holdings/snapshot");
  return res.data;
}

/**
 * 取得歷史快照資料。
 */
export async function getSnapshots(
  startDate?: string,
  endDate?: string
): Promise<InvestmentSnapshotPoint[]> {
  let path = "/api/holdings/snapshots";
  const params: string[] = [];
  if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`);
  if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`);
  if (params.length > 0) path += "?" + params.join("&");

  const res = await apiGet<SnapshotsResponse>(path);
  return res.data.map((item) => ({
    date: item.date,
    capturedAt: item.capturedAt,
    twValue: item.twValue ?? 0,
    usValue: item.usValue ?? 0,
    twCost: item.twCost ?? 0,
    usCost: item.usCost ?? 0,
    totalValue: item.totalValue,
    totalCost: item.totalCost,
  }));
}
