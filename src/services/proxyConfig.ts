/**
 * proxyConfig.ts
 * 
 * 管理全域跨域代理伺服器配置。
 * 支援多個代理伺服器以實現 Fallback 機制。
 */

export interface ProxyProvider {
  name: string;
  baseUrl: string;
  /**
   * 轉換目標 URL 為代理 URL 的函數
   * @param targetUrl 原始目標網址
   */
  transform: (targetUrl: string) => string;
}

export const PROXY_PROVIDERS: ProxyProvider[] = [
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

/**
 * 預設代理索引
 */
let currentProxyIndex = 0;

/**
 * 取得當前有效的代理發送請求
 */
export function getProxyUrl(targetUrl: string, retryIndex?: number): string {
  const index = retryIndex !== undefined ? retryIndex : currentProxyIndex;
  const provider = PROXY_PROVIDERS[index % PROXY_PROVIDERS.length];
  return provider.transform(targetUrl);
}

/**
 * 標記當前代理失效，切換至下一個
 */
export function switchToNextProxy() {
  currentProxyIndex = (currentProxyIndex + 1) % PROXY_PROVIDERS.length;
  console.log(`[ProxyConfig] 切換至下一個代理伺服器: ${PROXY_PROVIDERS[currentProxyIndex].name}`);
}

/**
 * Cloudflare Worker 建議代碼 (註解供參考)
 * ---------------------------------------
 * 如果使用者有佈署私有 Worker，可以將其網址加入 PROXY_PROVIDERS。
 */
