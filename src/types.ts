export type Currency = "TWD" | "USD" | "JPY";
export type AccountType = "asset" | "liability";

export interface Account {
  id: string;
  user_id?: string;     // 使用者 ID (來自 Supabase Auth)
  name: string;         // 帳戶名稱（顯示用，例如「中信活儲」「FT 美股」）
  category: string;     // 分類（例如「生活費」「核心投資」「緊急預備金」「負債」）
  currency: Currency;
  type: AccountType;    // "asset" = 正資產, "liability" = 負資產
  sort_order?: number;  // 排序順序
}

export interface MonthlyRecord {
  accountId: string;
  month: string; // YYYY-MM
  amount: number;
}
