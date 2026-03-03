# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 語言規定

所有回應與輸出一律使用**繁體中文**，包含：說明文字、程式碼註解、錯誤訊息說明、對話內容。

---

## 常用指令

```bash
npm run dev          # 啟動開發伺服器
npm run build        # 型別檢查 + 建置 + 複製 404.html（GitHub Pages 用）
npm run type-check   # 僅執行 vue-tsc 型別檢查
npm run preview      # 預覽建置結果
```

> 使用 pnpm 管理套件（node_modules/.pnpm）。

### 本地環境設定

複製 `.env.example` 為 `.env.local`：

```
VITE_USE_MOCK_DATA=true        # true = 使用假資料，不需要 Supabase 連線
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

`VITE_USE_MOCK_DATA=true` 時，所有 Supabase 呼叫由 mock 物件取代，`src/data.ts` 的 `seedAccounts` / `seedRecords` 作為初始資料。

---

## 技術架構

| 類別    | 技術 |
| ------- | ---- |
| 框架    | Vue 3 + TypeScript + Vite |
| UI 元件庫 | PrimeVue 4（Aura 主題） |
| 樣式    | Tailwind CSS v4 + `tailwindcss-primeui` |
| 圖表    | Chart.js（透過 PrimeVue Chart 元件） |
| 後端/DB | Supabase（PostgreSQL + Auth） |
| 路由    | Vue Router 4（Hash mode，`createWebHashHistory`） |
| 狀態管理 | Pinia（`useAssetManagerStore`） |

---

## 核心架構

### 資料模型

兩張 Supabase 資料表：
- `accounts`：帳戶（名稱、分類、幣別 `TWD/USD/JPY`、類型 `asset/liability`、`sort_order`）
- `monthly_records`：每月紀錄（`account_id`, `month: YYYY-MM`, `amount`）

`amountAtMonth(accountId, month)` 採「向前沿用」邏輯：若該月無資料，回傳最近一筆歷史值（而非 0）。

### 狀態管理

所有資料邏輯集中在 **`src/stores/assetManager.ts`**（`useAssetManagerStore`）。所有頁面皆從此 store 取得資料，勿另外建立 composable 平行管理相同狀態。

### 認證

`src/composables/useAuth.ts` — 模組層級 singleton，在 `App.vue#onMounted` 呼叫一次 `initAuth()`。
使用 Google OAuth（`supabase.auth.signInWithOAuth`），PKCE flow，`redirectTo` 動態取自 `window.location.origin + BASE_URL`。
路由守衛在 `src/router/index.ts`，`meta.requiresAuth: true` 的路由皆受保護。

### 外部 API

- **匯率**：`open.er-api.com/v6/latest/TWD`，透過 `allorigins.win` 代理解決 CORS
- **股價**：Yahoo Finance API，同樣透過 `allorigins.win` 代理

### 樣式系統

- CSS 變數定義於 `src/styles/variables.css`（淺色 / 深色兩套色盤）
- 深/淺色模式切換：設定 `document.documentElement.setAttribute('data-theme', 'dark'|'light')`
- PrimeVue 的 `darkModeSelector` 設為 `[data-theme="dark"]`
- 路徑別名：`@` → `src/`
- 部署 base path：`/money-record/`（GitHub Pages）

### 頁面路由

| 路由 | 頁面 | 說明 |
| ---- | ---- | ---- |
| `/login` | LoginPage | Google OAuth 登入 |
| `/dashboard` | DashboardPage | 資產總覽儀表板 |
| `/records` | RecordsPage | 每月帳戶金額記錄 |
| `/investments` | InvestmentsPage | 投資組合 |
| `/settings` | SettingsPage | 帳戶管理（新增/編輯/刪除/排序） |
