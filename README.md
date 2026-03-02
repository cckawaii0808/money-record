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

## 環境變數

在專案根目錄建立 `.env`：

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 頁面說明

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
