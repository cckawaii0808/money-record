# 資產管理系統（Naive UI）

這是一個用 Vue 3 + TypeScript + Naive UI + Vue Router 建立的前端原型，用來取代原本試算表流程。

## 核心能力

- 多銀行/多帳戶管理（資產、負債）
- 每月金額記錄（可新增與覆蓋同月資料）
- 單帳戶與多帳戶的月度變化
- 多帳戶加總折線圖（可選區間、折算 TWD）
- 帳戶可設定暱稱（篩選與選單顯示短名稱）
- 帳戶選單支援銀行 SVG 圖示（可擴充常見銀行）
- 帳戶頁採卡片管理（每張卡可直接調整暱稱）
- 儀表板顯示 KPI（總淨值、本月變化、資產、負債）
- 同幣別合計（TWD / USD / JPY）
- 匯率自動更新（可手動重抓），跨幣別折算為 TWD 比較

## 啟動

```bash
npm install
npm run dev
```

## 資料位置

- 初始帳戶與每月紀錄：`src/data.ts`
- 入口組件（殼層與導覽）：`src/App.vue`
- 路由：`src/router/index.ts`
- 共用常數：`src/constants/index.ts`
- 共用工具：`src/utils/formatters.ts`、`src/utils/monthUtils.ts`
- 全域樣式：`src/styles/variables.css`、`src/styles/global.css`
- 共享邏輯（composable）：`src/features/asset-manager/composables/useAssetManager.ts`
- 共用元件：`src/features/asset-manager/components/`
- 頁面：`src/pages/`

## 頁面區分

- `/dashboard`：首頁儀表板（KPI + 快速新增入口 + 最近走勢 + 佔比圖）
- `/records`：新增/更新每月記錄 + 批次編輯表格
- `/analysis`：月度變化、帳戶拆解、單帳戶趨勢、可指定起訖月份查看「選取帳戶加總折線圖」
- `/accounts`：帳戶卡片管理（新增帳戶、調整暱稱）

## 操作流程

1. 首次進入先看 `/dashboard`（先看健康度）
2. 新增本月資料走 `/records`（記錄流程集中）
3. 看單一/多帳戶變化走 `/analysis`
4. 調整帳戶名稱與暱稱走 `/accounts`
