# 資金記錄（MoneyRecord）

每個月記錄各帳戶金額，追蹤資產淨值的成長變化。

## 技術架構

| 類別 | 技術 |
|------|------|
| 框架 | Vue 3 + Composition API + TypeScript |
| 建置工具 | Vite |
| UI 元件庫 | PrimeVue 4（Aura 主題） |
| 樣式 | Tailwind CSS v4 + `tailwindcss-primeui` |
| 圖表 | Chart.js（透過 PrimeVue Chart 元件） |
| 認證 | Firebase Auth（Google OAuth） |
| 路由 | Vue Router 4（Hash mode） |
| API 後端 | Cloudflare Worker（`/api/*`） |
| 資料庫 | Cloudflare D1（透過 Worker API） |

## 資料流向

```
使用者 → Vue 前端
          ├── Firebase Auth（登入）
          └── Cloudflare Worker API（帳戶、每月紀錄、投資持倉、股票報價）
                   └── D1 Database（accounts、monthly_records、holdings、stock_price_snapshots、price_cache）
```

## 快速開始

```bash
pnpm install
pnpm dev
```

## 環境變數設定

請在 `moneyrecord/` 下建立 `.env.local`（可複製 `.env.example`）：

```env
# Firebase（認證用）
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...

# Worker API 位址
VITE_API_BASE_URL=https://api-money.ccxie.qzz.io

# 開發模式
VITE_USE_MOCK_DATA=false
```

## 專案結構

```
src/
├── pages/
│   ├── LoginPage.vue           # 登入（Google OAuth）
│   ├── DashboardPage.vue       # 總覽儀表板
│   ├── RecordsPage.vue         # 每月記錄
│   ├── SettingsPage.vue        # 帳戶設定
│   └── InvestmentsPage.vue     # 投資持倉管理
├── stores/
│   └── assetManager.ts         # Pinia store（核心資料與 API 邏輯）
├── services/
│   ├── apiClient.ts            # Worker API 共用 HTTP client
│   ├── holdingsApi.ts          # 持倉 CRUD API
│   ├── stockApi.ts             # 股票搜尋/報價 API
│   └── stockListSync.ts        # 台股清單快取
├── components/
│   ├── dashboard/              # 儀表板相關元件
│   ├── records/                # 紀錄相關元件
│   └── common/                 # 共用元件
├── router/
│   └── index.ts                # 路由 + 登入守衛
├── firebase.ts                 # Firebase Auth 初始化
├── types.ts                    # TypeScript 型別定義
└── data.ts                     # Mock/Seed 資料
```
