# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 語言規定

所有回應與輸出一律使用**繁體中文**，包含：說明文字、程式碼註解、錯誤訊息說明、對話內容。

---

## 常用指令

```bash
pnpm dev             # 啟動開發伺服器
pnpm build           # 型別檢查 + Vite 建置
pnpm type-check      # 僅執行 vue-tsc 型別檢查
pnpm preview         # 預覽建置結果
```

> 一律使用 pnpm 管理套件，以 pnpm-lock.yaml 為準。

### 本地環境設定

複製 `.env.example` 為 `.env.local`：

```
VITE_USE_MOCK_DATA=false       # true = 跳過登入並載入部分假資料
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_API_BASE_URL=http://localhost:8787
```

完整設定請參考 `.env.example`。`VITE_USE_MOCK_DATA=true` 時，從 `src/data.ts` 載入帳戶、月紀錄與持倉假資料，並跳過認證；這不是完整離線模式，帳戶寫入、報價、匯率等仍可能連線。`VITE_*` 變數會進入前端建置，不可當作後端秘密。

---

## 技術架構

| 類別    | 技術 |
| ------- | ---- |
| 框架    | Vue 3 + TypeScript + Vite |
| UI 元件庫 | PrimeVue 4（Aura 主題） |
| 樣式    | Tailwind CSS v4 + `tailwindcss-primeui` |
| 圖表    | Chart.js（透過 PrimeVue Chart 元件） |
| 後端/DB | Cloudflare Worker（Hono + Zod OpenAPI）+ D1（SQLite） |
| 認證 | Firebase Auth（Google OAuth） |
| 路由    | Vue Router 4（Hash mode，`createWebHashHistory`） |
| 狀態管理 | Pinia（`useAssetManagerStore`） |

---

## 核心架構

### 資料模型

帳戶記錄的核心 D1 資料表（定義與 migration 位於相鄰的 `money-record-api/` 專案）：
- `accounts`：帳戶（名稱、分類、幣別 `TWD/USD/JPY`、類型 `asset/liability`、`sort_order`）
- `monthly_records`：每月紀錄（`account_id`, `month: YYYY-MM`, `amount`）

投資資料由 Worker 持倉與快照 API 管理。前端透過 `src/services/accountsApi.ts`、`holdingsApi.ts` 與 `apiClient.ts` 存取後端，不直接存取資料庫。

`amountAtMonth(accountId, month)` 採「向前沿用」邏輯：若該月無資料，回傳最近一筆歷史值（而非 0）。

### 狀態管理

所有資料邏輯集中在 **`src/stores/assetManager.ts`**（`useAssetManagerStore`）。所有頁面皆從此 store 取得資料，勿另外建立 composable 平行管理相同狀態。

### 認證

`src/composables/useAuth.ts` — 模組層級 singleton，在 `App.vue#onMounted` 呼叫一次 `initAuth()`。
使用 Firebase Auth 的 Google popup 登入（`signInWithPopup`），設定位於 `src/firebase.ts`。`apiClient.ts` 將 Firebase ID Token 加入 Worker 請求的 Bearer header。
路由守衛在 `src/router/index.ts`，`meta.requiresAuth: true` 的路由皆受保護。

### 外部 API

- **匯率**：直接呼叫 `open.er-api.com/v6/latest/TWD`
- **股價／美股搜尋**：透過 Worker API 代理；不要新增前端外部報價 API 金鑰
- **台股搜尋**：使用 `src/data/tw_stocks.json` 初始化記憶體快取，正式模式也會使用

### 樣式系統

- CSS 變數定義於 `src/styles/variables.css`（淺色 / 深色兩套色盤）
- 深/淺色模式切換：設定 `document.documentElement.setAttribute('data-theme', 'dark'|'light')`
- PrimeVue 的 `darkModeSelector` 設為 `[data-theme="dark"]`
- 路徑別名：`@` → `src/`
- 部署 base path：`/`（以 `vite.config.ts` 為準）

### 頁面路由

| 路由 | 頁面 | 說明 |
| ---- | ---- | ---- |
| `/login` | LoginPage | Google OAuth 登入 |
| `/dashboard` | DashboardPage | 資產總覽儀表板 |
| `/records` | RecordsPage | 每月帳戶金額記錄 |
| `/investments` | InvestmentsPage | 投資組合 |
| `/leaderboard` | LeaderboardPage | 淨資產排行榜（第四個分頁，需登入） |
| `/settings` | 重新導向 `/records` | 帳戶管理已整合至每月記錄 |
