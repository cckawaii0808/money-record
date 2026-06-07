/**
 * Worker API 客戶端。
 *
 * 說明：
 * - 統一處理 Firebase ID Token 取得與注入。
 * - 所有打 Worker 的請求都走這裡，不要直接用 fetch。
 * - VITE_API_BASE_URL 未設定時，fallback 到 workers.dev 網址。
 */

import { auth } from "../firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://money-record-api.a23730800.workers.dev";

/**
 * 取得目前登入使用者的 Firebase ID Token。
 * Token 有效期約 1 小時，Firebase SDK 會自動更新。
 */
async function getIdToken(): Promise<string | null> {
  if (!auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error("[apiClient] 取得 ID Token 失敗：", error);
    return null;
  }
}

/**
 * 帶 Firebase 認證 Header 的 fetch 包裝。
 *
 * @param path - API 路徑（e.g. `/api/stocks/search?q=2330`）
 * @param options - 標準 RequestInit 選項
 * @returns Response 物件
 * @throws 網路錯誤或 token 取得失敗時拋出
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getIdToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}

/**
 * 帶認證的 GET 請求，並自動解析 JSON。
 *
 * @param path - API 路徑
 * @returns 解析後的 JSON 資料
 * @throws HTTP 非 2xx 時拋出錯誤（含錯誤訊息）
 */
export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch(path);

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json() as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // 忽略 JSON 解析失敗
    }
    throw new Error(`[Worker API] ${message}`);
  }

  return res.json() as Promise<T>;
}

/**
 * 帶認證的 POST 請求。
 *
 * @param path - API 路徑
 * @param body - 要傳送的物件資料
 * @returns 解析後的 JSON 資料
 */
export async function apiPost<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errorBody = (await res.json()) as { message?: string };
      if (errorBody.message) message = errorBody.message;
    } catch {
      // 忽略 JSON 解析失敗
    }
    throw new Error(`[Worker API] ${message}`);
  }

  return res.json() as Promise<T>;
}

/**
 * 帶認證的 PATCH 請求。
 *
 * @param path - API 路徑
 * @param body - 要傳送的物件資料
 * @returns 解析後的 JSON 資料
 */
export async function apiPatch<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errorBody = (await res.json()) as { message?: string };
      if (errorBody.message) message = errorBody.message;
    } catch {
      // 忽略 JSON 解析失敗
    }
    throw new Error(`[Worker API] ${message}`);
  }

  return res.json() as Promise<T>;
}

/**
 * 帶認證的 PUT 請求。
 */
export async function apiPut<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errorBody = (await res.json()) as { message?: string };
      if (errorBody.message) message = errorBody.message;
    } catch {
      // 忽略 JSON 解析失敗
    }
    throw new Error(`[Worker API] ${message}`);
  }

  return res.json() as Promise<T>;
}

/**
 * 帶認證的 DELETE 請求。
 *
 * @param path - API 路徑
 * @returns 解析後的 JSON 資料
 */
export async function apiDelete<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch(path, {
    method: "DELETE"
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const errorBody = (await res.json()) as { message?: string };
      if (errorBody.message) message = errorBody.message;
    } catch {
      // 忽略 JSON 解析失敗
    }
    throw new Error(`[Worker API] ${message}`);
  }

  return res.json() as Promise<T>;
}
