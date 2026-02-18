import type { AccountType } from "../types";

export const ALLOCATION_PALETTE = [
  "#0ea5e9",
  "#f97316",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#3b82f6",
  "#14b8a6",
  "#e11d48",
  "#06b6d4",
  "#84cc16"
] as const;

export const DATE_PICKER_YEAR_RANGE: [number, number] = [
  2020,
  2030
];

export const EARLIEST_SELECTABLE_MONTH = "2020-01";

export const TYPE_LABELS: Record<AccountType, string> = {
  asset: "資產",
  liability: "負債"
};

export function categoryTagType(category: string): "success" | "info" | "warning" | "error" | "default" {
  const lower = category.toLowerCase();
  if (lower.includes("投資")) {
    return "success";
  }
  if (lower.includes("生活") || lower.includes("轉帳") || lower.includes("儲蓄")) {
    return "info";
  }
  if (lower.includes("預備") || lower.includes("緊急")) {
    return "warning";
  }
  if (lower.includes("負債")) {
    return "error";
  }
  return "default";
}
