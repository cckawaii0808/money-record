# 資金記錄（MoneyRecord）

每個月記錄各帳戶金額，追蹤資產淨值的成長變化。

## 技術架構

| 類別      | 技術                                        |
| --------- | ------------------------------------------- |
| 框架      | Vue 3 + TypeScript + Vite                   |
| UI 元件庫 | **PrimeVue 4**（Aura 主題）                 |
| 樣式      | **Tailwind CSS v4** + `tailwindcss-primeui` |
| 圖表      | **Chart.js**（透過 PrimeVue Chart 元件）    |
| 後端 / DB | Supabase（PostgreSQL + Auth）               |
| 路由      | Vue Router 4（Hash mode）                   |

## 快速開始

```bash
npm install
npm run dev
```

> 需要 `.env` 設定 Supabase URL 與 Anon Key，詳見下方。

## 開發環境與環境變數設定

要讓專案正常運作抓取美股即時報價與儲存您的資料，您需要設定對應的環境變數。
請在專案根目錄建立一個 `.env.local` 檔案（可以複製 `.env.example` 來修改）。

### 1. Supabase (資料庫與身分驗證)

專案使用 Supabase 儲存資料，請依照以下步驟取得金鑰：

1. 前往 [Supabase 官網](https://supabase.com/) 註冊並登入。
2. 建立一個新的 Project。
3. 進入專案的 **Project Settings** (左下角齒輪) -> **API**。
4. 找到 **Project URL** 並複製到 `.env.local` 的 `VITE_SUPABASE_URL`。
5. 找到 **Project API keys** 中的 `anon` `public` 金鑰，複製到 `.env.local` 的 `VITE_SUPABASE_ANON_KEY`。

### 2. Finnhub (美股 API)

專案使用 Finnhub 獲取免費用於商業的美股即時報價，請依照以下步驟取得金鑰：

1. 前往 [Finnhub 官網](https://finnhub.io/) 註冊免費帳號 (Basic Free Plan)。
2. 登入後進入 Dashboard (https://finnhub.io/dashboard)。
3. 在上方會看到一串長達 40 個字元的 API Key (例如：`d6jo54prxxxxxxxxxx...`)。
4. 將整串複製到 `.env.local` 的 `VITE_FINNHUB_API_KEY`。

`.env.local` 範例：

```env
VITE_SUPABASE_URL=https://您的專案ID.supabase.co
VITE_SUPABASE_ANON_KEY=您的長串ANON金鑰
VITE_FINNHUB_API_KEY=您的40字元Finnhub金鑰
```

## GitHub Actions 正式環境部署設定

如果您將專案 Fork 到自己的 GitHub 並希望透過 GitHub Pages 自動部署，請記得在 GitHub 設定您的金鑰 (Repository Secrets)：

1. 進入您在 GitHub 的專案頁面。
2. 點選 **Settings** 頁籤。
3. 左側選單找到 **Secrets and variables** -> **Actions**。
4. 點選右上角的 **New repository secret** 綠色按鈕。
5. 分別新增以下三個 Secrets，名稱必須完全一致：
   - `VITE_SUPABASE_URL` (貼上您的 Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` (貼上您的 Supabase Anon Key)
   - `VITE_FINNHUB_API_KEY` (貼上您的 Finnhub API Key)

_這些機密金鑰會在部署流程 (deploy.yml) 的 Build 階段被注入到您的正式版網頁中。_

## 專案設定與執行頁面說明

| 路由         | 功能                                                       |
| ------------ | ---------------------------------------------------------- |
| `/dashboard` | 總覽：本月淨值 KPI、6 個月趨勢折線、資產佔比圓餅、本月明細 |
| `/records`   | 每月記錄：月份切換 + 點擊帳戶直接編輯金額                  |
| `/settings`  | 帳戶管理：新增、編輯、刪除帳戶                             |

## 操作流程

1. **每個月初** → 進入 `/records`，選月份，逐一點擊帳戶輸入最新金額
2. **看總覽** → `/dashboard` 一眼掌握淨值、趨勢、佔比
3. **調整帳戶** → `/settings` 新增或修改帳戶設定

## 專案結構

```
src/
├── pages/
│   ├── LoginPage.vue          # 登入（Google OAuth）
│   ├── DashboardPage.vue      # 總覽儀表板
│   ├── RecordsPage.vue        # 每月記錄
│   └── SettingsPage.vue       # 帳戶設定
├── features/asset-manager/
│   ├── composables/
│   │   └── useAssetManager.ts # 核心資料邏輯（帳戶、記錄、計算）
│   └── utils/
│       └── bankIcons.ts       # 銀行 icon 對應
├── styles/
│   ├── tailwind.css           # Tailwind v4 入口 + PrimeUI plugin
│   ├── variables.css          # 色盤 CSS 變數（淺色 / 深色模式）
│   └── global.css             # 全域基礎樣式
├── router/index.ts            # 路由 + 登入守衛
├── supabase.ts                # Supabase client
└── types.ts                   # TypeScript 型別定義
```

## 設計系統

- **主色**：Indigo 靛藍紫（`#4f46e5`）— 沉穩信賴的 SaaS 質感
- **背景**：Slate-100 灰白底（`#f1f5f9`）+ 純白卡片
- **字型**：DM Sans（介面）/ DM Mono（數字金額）
- **風格**：Notion / Stripe / Linear 淺色美學
