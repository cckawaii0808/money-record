import type { Account, MonthlyRecord } from "../types";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./apiClient";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface AccountFromApi {
  id: string;
  name: string;
  alias?: string | null;
  category: string;
  currency: Account["currency"];
  type: Account["type"];
  color?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function toAccount(item: AccountFromApi): Account {
  return {
    id: item.id,
    name: item.name,
    alias: item.alias ?? undefined,
    category: item.category,
    currency: item.currency,
    type: item.type,
    color: item.color ?? undefined,
    sort_order: item.sortOrder,
  };
}

export async function getAccounts(): Promise<Account[]> {
  const res = await apiGet<ApiResponse<AccountFromApi[]>>("/api/accounts");
  return res.data.map(toAccount);
}

export async function createAccount(payload: Omit<Account, "id"> & { id?: string }): Promise<Account> {
  const res = await apiPost<ApiResponse<AccountFromApi>>("/api/accounts", {
    id: payload.id,
    name: payload.name,
    alias: payload.alias ?? null,
    category: payload.category,
    currency: payload.currency,
    type: payload.type,
    color: payload.color ?? null,
    sort_order: payload.sort_order,
  });
  return toAccount(res.data);
}

export async function updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
  const res = await apiPatch<ApiResponse<AccountFromApi>>(`/api/accounts/${id}`, {
    name: updates.name,
    alias: updates.alias ?? undefined,
    category: updates.category,
    currency: updates.currency,
    type: updates.type,
    color: updates.color ?? undefined,
    sort_order: updates.sort_order,
  });
  return toAccount(res.data);
}

export async function deleteAccount(id: string): Promise<Account[]> {
  const res = await apiDelete<ApiResponse<AccountFromApi[]>>(`/api/accounts/${id}`);
  return res.data.map(toAccount);
}

export async function reorderAccounts(items: Array<{ id: string; sort_order: number }>): Promise<void> {
  await apiPatch<{ message: string }>("/api/accounts/reorder", { items });
}

export async function getMonthlyRecords(month?: string): Promise<MonthlyRecord[]> {
  const path = month ? `/api/monthly-records?month=${encodeURIComponent(month)}` : "/api/monthly-records";
  const res = await apiGet<ApiResponse<MonthlyRecord[]>>(path);
  return res.data;
}

export async function bulkUpsertMonthlyRecords(
  month: string,
  entries: Array<{ accountId: string; amount: number }>
): Promise<{ message: string; data: MonthlyRecord[] }> {
  return apiPut<{ message: string; data: MonthlyRecord[] }>("/api/monthly-records/bulk", { month, entries });
}
