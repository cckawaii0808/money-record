/**
 * Gemini / Gemma API 封裝
 *
 * 策略：
 *   1. 依配額寬鬆度排序嘗試多個模型，429 自動切換到下一個。
 *   2. 從 response header 讀取剩餘配額，暫時快取到記憶體，避免下次浪費一次失敗請求。
 *   3. 強制 system instruction 為繁體中文。
 *   4. 自動過濾 Gemma 的 thought 段，只取最終回覆。
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// 依每日配額從寬到嚴排序，由上到下遞補
const MODEL_CHAIN = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemma-3-27b-it"
];

const SYSTEM_PROMPT =
  "你是台灣用戶的個人記帳 AI 助理「小錢包」，個性活潑親切、會用台灣口語。" +
  "請一律使用繁體中文回答，嚴禁使用簡體中文或英文。" +
  "回答要精簡重點（不超過 120 字），可以偶爾搭配 1～2 個表情符號讓語氣更生動，但不要過度。" +
  "當使用者提供財務資料時，請給出具體觀察與一兩句實用建議，而不是空泛的讚美。";

/** 該模型當日剩餘請求數，null 代表未知 */
const quotaCache = new Map<string, number | null>();

function isKeyConfigured(): boolean {
  return typeof API_KEY === "string" && API_KEY.length > 0;
}

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly code: "NO_KEY" | "ALL_MODELS_EXHAUSTED" | "NETWORK" | "BAD_RESPONSE"
  ) {
    super(message);
  }
}

async function callModel(model: string, userPrompt: string): Promise<string> {
  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": API_KEY as string
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: userPrompt }] }]
    })
  });

  // 記錄剩餘配額，避免下次盲目重試
  const remaining = res.headers.get("x-ratelimit-remaining-requests");
  if (remaining !== null) {
    const n = Number(remaining);
    quotaCache.set(model, Number.isFinite(n) ? n : null);
  }

  if (res.status === 429) {
    quotaCache.set(model, 0);
    throw new Error("RATE_LIMIT");
  }
  if (!res.ok) {
    throw new Error(`HTTP_${res.status}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  let reply = "";
  for (const p of parts) {
    if (p?.text && !p?.thought) reply += p.text;
  }
  if (!reply && parts.length > 0 && parts[0]?.text) {
    reply = parts[0].text;
  }
  if (!reply) {
    throw new Error("EMPTY_REPLY");
  }
  return reply.trim();
}

/**
 * 送出 prompt 給 Gemini，遇到配額用盡會自動切下一個模型。
 */
export async function askGemini(userPrompt: string): Promise<string> {
  if (!isKeyConfigured()) {
    throw new GeminiError("尚未設定 VITE_GEMINI_API_KEY", "NO_KEY");
  }

  // 過濾掉已知當日耗盡的模型；若全都被標為 0 則清空重試一次（配額可能已跨日重置）
  let chain = MODEL_CHAIN.filter((m) => quotaCache.get(m) !== 0);
  if (chain.length === 0) {
    quotaCache.clear();
    chain = [...MODEL_CHAIN];
  }

  let lastErr: unknown = null;
  for (const model of chain) {
    try {
      return await callModel(model, userPrompt);
    } catch (e) {
      lastErr = e;
      // 429 以外的錯誤也繼續嘗試下一個，提升可用性
      continue;
    }
  }
  throw new GeminiError(
    `所有模型都暫時無法回應：${String(lastErr)}`,
    "ALL_MODELS_EXHAUSTED"
  );
}

export function isAiAvailable(): boolean {
  return isKeyConfigured();
}
