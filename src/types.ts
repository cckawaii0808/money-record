export type Currency = "TWD" | "USD" | "JPY";
export type AccountType = "asset" | "liability";

export interface Account {
  id: string;
  user_id?: string;     // 使用者 ID (來自 Firebase Auth)
  name: string;         // 帳戶名稱（顯示用，例如「中信活儲」「FT 美股」）
  alias?: string;       // 別名（選填）
  category: string;     // 分類（例如「生活費」「核心投資」「緊急預備金」「負債」）
  currency: Currency;
  type: AccountType;    // "asset" = 正資產, "liability" = 負資產
  color?: string;       // 顏色（選填，用於 UI 顯示）
  sort_order?: number;  // 排序順序
}

export interface MonthlyRecord {
  accountId: string;
  month: string; // YYYY-MM
  amount: number;
}

export interface Holding {
  id: string;
  symbol: string;
  market: string;
  name: string;
  shares: number | null;
  loaned_shares: number | null;
  cost_basis: number | null;
  current_price: number | null;
  currency: string;
}
