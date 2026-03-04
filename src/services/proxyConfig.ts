/**
 * proxyConfig.ts
 * 
 * 管理全域跨域代理伺服器配置。
 * 支援多個代理伺服器以實現 Fallback 機制。
 */

/** 
 * [重要] 私有代理配置 (例如 Cloudflare Worker)
 * 如果您有自建的代理，請填寫在這裡，它會被優先使用。
 */
const PRIVATE_PROXY_URL = ""; // 例如: "https://your-worker.your-name.workers.dev/?url="

export interface ProxyProvider {
  name: string;
  baseUrl: string;
  transform: (targetUrl: string) => string;
}

const PUBLIC_PROVIDERS: ProxyProvider[] = [
  // 1. corsproxy.io - 簡單且通常有效
  {
    name: "corsproxy.io",
    baseUrl: "https://corsproxy.io/",
    transform: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
  },
  // 2. allorigins.win
  {
    name: "allorigins",
    baseUrl: "https://api.allorigins.win/get",
    transform: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
  }
];

// 組合最終的代理清單
export const PROXY_PROVIDERS: ProxyProvider[] = [];

if (PRIVATE_PROXY_URL) {
  PROXY_PROVIDERS.push({
    name: "private-worker",
    baseUrl: PRIVATE_PROXY_URL,
    transform: (url) => `${PRIVATE_PROXY_URL}${encodeURIComponent(url)}`
  });
}

PROXY_PROVIDERS.push(...PUBLIC_PROVIDERS);

/**
 * 預設代理索引
 */
let currentProxyIndex = 0;

/**
 * 取得當前有效的代理發送請求
 */
export function getProxyUrl(targetUrl: string, retryIndex?: number): string {
  if (PROXY_PROVIDERS.length === 0) return targetUrl;
  const index = retryIndex !== undefined ? retryIndex : currentProxyIndex;
  const provider = PROXY_PROVIDERS[index % PROXY_PROVIDERS.length];
  return provider.transform(targetUrl);
}

/**
 * 標記當前代理失效，切換至下一個
 */
export function switchToNextProxy() {
  if (PROXY_PROVIDERS.length <= 1) return;
  currentProxyIndex = (currentProxyIndex + 1) % PROXY_PROVIDERS.length;
  console.log(`[ProxyConfig] 切換至下一個代理伺服器: ${PROXY_PROVIDERS[currentProxyIndex].name}`);
}
