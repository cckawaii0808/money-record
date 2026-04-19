<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useIsDesktop } from "../composables/useIsDesktop";
const { isDesktop } = useIsDesktop();
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import AutoComplete from "primevue/autocomplete";
import Tag from "primevue/tag";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import type { Holding } from "../types";
import { useAssetManagerStore } from "../stores/assetManager";

// AutoComplete 選取時 symbol 暫時為 object，故表單型別獨立定義
type HoldingForm = Omit<Holding, "symbol"> & { symbol: string | any };
import {
  fetchStockPrice,
  fetchMultipleStockPrices,
  searchStocks,
} from "../services/stockApi";
import { initStockCache } from "../services/stockListSync";
import { searchStocksFromCache } from "../services/stockListApi";
import { getCurrentMonth } from "../utils/monthUtils";

const store = useAssetManagerStore();
const toast = useToast();
const confirm = useConfirm();

// 狀態過濾
const includeLoaned = ref(true);

// 新增 / 編輯邏輯
const editVisible = ref(false);
const isEditing = ref(false);
const editHasLoaned = ref(false);
const isFetchingPrice = ref(false);
const isSearching = ref(false);

const searchResults = ref<any[]>([]);

const editForm = ref<HoldingForm>({
  id: "",
  symbol: "",
  market: "TW",
  name: "",
  shares: null,
  loaned_shares: null,
  cost_basis: null,
  current_price: 0,
  currency: "TWD",
});

let searchTimeout: any = null;

/**
 * 搜尋股票：
 * - 台股 (TW)：優先從記憶體快取即時搜尋（無延遲）
 * - 美股 (US)：透過 Yahoo Finance 即時搜尋 (防抖 300ms)
 */
async function onSearchStock(event: any) {
  if (editForm.value.market === "TW") {
    searchResults.value = searchStocksFromCache(event.query, "TW");
  } else {
    // US
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      isSearching.value = true;
      try {
        searchResults.value = await searchStocks(event.query, "US");
      } finally {
        isSearching.value = false;
      }
    }, 300);
  }
}

const marketOptions = [
  { label: "台股 (TW)", value: "TW", currency: "TWD" },
  { label: "美股 (US)", value: "US", currency: "USD" },
];

/** 選擇後顯示的代號（自動從 .code 或 .symbol 去後綴推算） */
const selectedCode = computed(() => {
  const sym = editForm.value.symbol;
  if (!sym || typeof sym !== "object") return "";
  return (
    (sym as any).code ?? ((sym as any).symbol ?? "").replace(/\.(TW|TWO)$/i, "")
  );
});

/** 選擇後顯示的中文名稱 */
const selectedName = computed(() => {
  const sym = editForm.value.symbol;
  if (!sym || typeof sym !== "object") return "";
  return (sym as any).name ?? "";
});

function openAdd() {
  isEditing.value = false;
  editHasLoaned.value = false;
  editForm.value = {
    ...{
      id: "inv-" + Date.now(),
      symbol: "",
      market: "TW",
      name: "",
      shares: null,
      loaned_shares: null,
      cost_basis: null,
      current_price: 0,
      currency: "TWD",
    },
  };
  editVisible.value = true;
}

function openEdit(h: HoldingForm) {
  isEditing.value = true;
  editHasLoaned.value = (h.loaned_shares || 0) > 0;
  // 將字串 symbol 包成 object 給 AutoComplete 顯示
  editForm.value = { ...h, symbol: { symbol: h.symbol, name: h.name } as any };
  editVisible.value = true;
}

function onMarketChange() {
  const selected = marketOptions.find((m) => m.value === editForm.value.market);
  if (selected) {
    editForm.value.currency = selected.currency;
  }

  // 切換市場時清空目前輸入的資料，避免誤混
  editForm.value.symbol = "";
  editForm.value.name = "";
  editForm.value.shares = null;
  editForm.value.loaned_shares = null;
  editForm.value.cost_basis = null;
  editForm.value.current_price = 0;
  editHasLoaned.value = false;
  searchResults.value = [];
}

async function saveInvestment() {
  const shares = editForm.value.shares || 0;
  const loaned = editForm.value.loaned_shares || 0;
  if (loaned > shares) {
    toast.add({
      severity: "error",
      summary: "錯誤",
      detail: "借出股數不能大於持有股數",
      life: 3000,
    });
    return;
  }

  // AutoComplete 選擇的結果是一個 Object
  let finalSymbol = "";
  let finalName = "";
  if (
    typeof editForm.value.symbol === "object" &&
    editForm.value.symbol !== null
  ) {
    finalSymbol = (editForm.value.symbol as any).symbol;
    finalName = (editForm.value.symbol as any).name;
  } else {
    finalSymbol = editForm.value.symbol as string;
  }

  const payload = {
    ...editForm.value,
    symbol: finalSymbol,
    name: finalName || finalSymbol,
  };

  if (isEditing.value) {
    const { id, ...updates } = payload;
    await store.updateHolding(id, updates);
  } else {
    const { id: _id, ...newPayload } = payload;
    await store.addHolding(newPayload);
  }
  editVisible.value = false;
}

// 格式化工具
const fmtCurrency = (v: number, curr = "TWD") => {
  return new Intl.NumberFormat(curr === "TWD" ? "zh-TW" : "en-US", {
    style: "currency",
    currency: curr,
    maximumFractionDigits: curr === "TWD" ? 0 : 2,
  }).format(v);
};

/** 移除台股後綴 (.TW / .TWO) 用於顯示 */
const fmtSymbol = (sym: string) => {
  return sym.replace(/\.(TW|TWO)$/i, "");
};

// 狀態過濾
const twHoldings = computed(() =>
  store.holdings.filter((h) => h.market === "TW"),
);
const usHoldings = computed(() =>
  store.holdings.filter((h) => h.market === "US"),
);

// --- 計算邏輯 ---
function calcValue(h: Holding) {
  const shares = h.shares || 0;
  const loaned = h.loaned_shares || 0;
  const activeShares = includeLoaned.value ? shares : shares - loaned;
  return activeShares * (h.current_price || 0);
}

function calcCost(h: Holding) {
  const shares = h.shares || 0;
  const loaned = h.loaned_shares || 0;
  const activeShares = includeLoaned.value ? shares : shares - loaned;
  return activeShares * (h.cost_basis || 0);
}

// 假設匯率 USD/TWD 為 32 (未來會從 assetManager 讀取)
const FX_RATE = 32;

const totalInvestedTWD = computed(() => {
  return store.holdings.reduce((acc, h) => {
    let val = calcValue(h);
    if (h.currency === "USD") val *= FX_RATE;
    return acc + val;
  }, 0);
});

const totalPnLTWD = computed(() => {
  return store.holdings.reduce((acc, h) => {
    let pnl = calcValue(h) - calcCost(h);
    if (h.currency === "USD") pnl *= FX_RATE;
    return acc + pnl;
  }, 0);
});

const totalLoanedTWD = computed(() => {
  return store.holdings.reduce((acc, h) => {
    const loaned = h.loaned_shares || 0;
    let val = loaned * (h.current_price || 0);
    if (h.currency === "USD") val *= FX_RATE;
    return acc + val;
  }, 0);
});

// Sync logic state
const syncVisible = ref(false);
const syncMarket = ref<"ALL" | "TW" | "US">("ALL");
const syncAccountTW = ref<string>("");
const syncAccountUS = ref<string>("");

// Sync computed
const accountOptionsForSyncTW = computed(() => {
  return store.accounts
    .filter((a) => a.type === "asset" && a.currency === "TWD")
    .map((a) => ({ label: a.name, value: a.id }));
});

const accountOptionsForSyncUS = computed(() => {
  return store.accounts
    .filter((a) => a.type === "asset" && a.currency === "USD")
    .map((a) => ({ label: a.name, value: a.id }));
});

const twTotalSyncValue = computed(() => {
  return twHoldings.value.reduce((acc, h) => acc + calcValue(h), 0);
});

const usTotalSyncValue = computed(() => {
  return usHoldings.value.reduce((acc, h) => acc + calcValue(h), 0); // Native USD value
});

function openSync() {
  syncMarket.value = "ALL";
  syncVisible.value = true;
}

async function confirmSync() {
  const entries: Array<{ accountId: string; amount: number }> = [];

  if (syncMarket.value === "ALL" || syncMarket.value === "TW") {
    if (!syncAccountTW.value) {
      toast.add({
        severity: "error",
        summary: "錯誤",
        detail: "請選擇台股同步目標帳戶",
        life: 3000,
      });
      return;
    }
    entries.push({
      accountId: syncAccountTW.value,
      amount: Math.round(twTotalSyncValue.value),
    });
  }

  if (syncMarket.value === "ALL" || syncMarket.value === "US") {
    if (!syncAccountUS.value) {
      toast.add({
        severity: "error",
        summary: "錯誤",
        detail: "請選擇美股同步目標帳戶",
        life: 3000,
      });
      return;
    }
    entries.push({
      accountId: syncAccountUS.value,
      amount: Math.round(usTotalSyncValue.value),
    });
  }

  if (entries.length === 0) return;

  try {
    const result = await store.bulkUpsertMonthlyRecords(
      getCurrentMonth(),
      entries,
    );
    if (result.type === "success") {
      toast.add({
        severity: "success",
        summary: "同步成功",
        detail: result.message,
        life: 3000,
      });
      syncVisible.value = false;
    } else {
      toast.add({
        severity: "error",
        summary: "同步失敗",
        detail: result.message,
        life: 3000,
      });
    }
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "同步發生錯誤",
      detail: String(e),
      life: 3000,
    });
  }
}

async function removeInvestment() {
  confirm.require({
    message: "確定要刪除這筆投資嗎？",
    header: "",
    rejectProps: {
      label: "取消",
      severity: "secondary",
      text: true,
    },
    acceptProps: {
      label: "刪除",
      severity: "danger",
    },
    accept: async () => {
      try {
        await store.deleteHolding(editForm.value.id);
        toast.add({
          severity: "success",
          summary: "成功",
          detail: "投資紀錄已刪除",
          life: 3000,
        });
        editVisible.value = false;
      } catch (err: any) {
        toast.add({
          severity: "error",
          summary: "錯誤",
          detail: err.message || "刪除失敗",
          life: 3000,
        });
      }
    },
  });
}

function confirmDeleteInvest(h: Holding) {
  confirm.require({
    message: `確定要刪除「${h.name || h.symbol}」的投資紀錄嗎？`,
    header: "刪除投資",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "取消",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "刪除",
      severity: "danger",
    },
    accept: async () => {
      try {
        await store.deleteHolding(h.id);
        toast.add({
          severity: "success",
          summary: "成功",
          detail: "投資紀錄已刪除",
          life: 3000,
        });
      } catch (err: any) {
        toast.add({
          severity: "error",
          summary: "錯誤",
          detail: err.message || "刪除失敗",
          life: 3000,
        });
      }
    },
  });
}

// --- API 相關邏輯 ---
const isRefreshingAll = ref(false);

async function refreshPrices() {
  isRefreshingAll.value = true;
  try {
    const symbols = store.holdings.map((h) => h.symbol);
    const prices = await fetchMultipleStockPrices(symbols);
    store.batchCacheHoldingPrices(prices);
  } finally {
    isRefreshingAll.value = false;
  }
}

async function onSymbolSelect(event: any) {
  // 選取 AutoComplete 的項目後，自動觸發價格獲取與市場切換
  const selected = event.value;
  if (!selected || !selected.symbol) return;

  const rawSym = selected.symbol.trim();

  if (rawSym.endsWith(".TW") || /^\d{4}$/.test(rawSym)) {
    editForm.value.market = "TW";
    editForm.value.currency = "TWD";
  } else {
    editForm.value.market = "US";
    editForm.value.currency = "USD";
  }

  isFetchingPrice.value = true;
  try {
    const price = await fetchStockPrice(rawSym);
    if (price !== null) {
      editForm.value.current_price = price;
    }
  } finally {
    isFetchingPrice.value = false;
  }
}

onMounted(() => {
  refreshPrices();

  // 背景嘗試升級至 Firebase 資料（不阻塞頁面，搜尋功能即時可用）
  initStockCache();
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-24 relative">
    <!-- Header: 桌面版 Teleport 到 App.vue header，手機版 sticky -->
    <Teleport defer to="#app-header-slot" :disabled="!isDesktop">
      <div
        :class="
          isDesktop
            ? 'grid grid-cols-3 items-center w-full'
            : 'block text-center mb-6 sticky top-0 z-[50] bg-[var(--app-bg)]/95 backdrop-blur-md py-3 -mx-4 px-4'
        "
      >
        <h1
          v-if="isDesktop"
          class="text-2xl font-bold text-[var(--text-main)] m-0"
        >
          投資組合
        </h1>
        <div
          :class="
            isDesktop
              ? 'flex justify-center'
              : 'w-full overflow-x-auto hide-scrollbar'
          "
        >
          <div
            class="inline-flex items-center gap-1.5 bg-[var(--surface)] px-2 py-1.5 rounded-[20px] shadow-sm border border-[var(--line-soft)] whitespace-nowrap min-w-max mx-auto"
          >
            <div class="flex items-center gap-2 px-2">
              <span class="text-[13px] font-bold text-[var(--text-sub)]"
                >包含借券</span
              >
              <ToggleSwitch v-model="includeLoaned" />
            </div>
            <div
              class="w-px h-5 bg-[var(--line-soft)] mx-1 hidden sm:block"
            ></div>
            <Button
              label="報價"
              icon="pi pi-sync"
              text
              rounded
              size="small"
              severity="secondary"
              :loading="isRefreshingAll"
              @click="refreshPrices"
              class="!px-3 font-bold text-[var(--text-main)]"
            />
            <Button
              label="同步"
              icon="pi pi-cloud-upload"
              text
              rounded
              size="small"
              severity="secondary"
              @click="openSync"
              class="!px-3 font-bold text-[var(--text-main)]"
            />
            <Button
              label="新增"
              icon="pi pi-plus"
              rounded
              size="small"
              @click="openAdd"
              class="!px-3 font-bold"
            />
          </div>
        </div>
        <div v-if="isDesktop"></div>
      </div>
    </Teleport>

    <!-- Apollo KPI 摘要區 (橫向卡片) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- 總投資現值 -->
      <div class="apollo-card flex flex-col justify-between h-[130px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-bold text-[var(--text-main)]"
              >總投資現值 (TWD)</span
            >
            <span
              class="text-[26px] font-black tabular-nums tracking-tight text-[var(--text-main)]"
            >
              {{ fmtCurrency(totalInvestedTWD, "TWD") }}
            </span>
          </div>
          <div
            class="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)]"
          >
            <i class="pi pi-chart-line text-lg"></i>
          </div>
        </div>
      </div>

      <!-- 未實現損益 -->
      <div class="apollo-card flex flex-col justify-between h-[130px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-bold text-[var(--text-main)]"
              >未實現損益 (TWD)</span
            >
            <span
              class="text-[26px] font-black tabular-nums tracking-tight"
              :class="
                totalPnLTWD >= 0
                  ? 'text-[var(--positive)]'
                  : 'text-[var(--negative)]'
              "
            >
              {{ totalPnLTWD >= 0 ? "+" : ""
              }}{{ fmtCurrency(totalPnLTWD, "TWD") }}
            </span>
          </div>
          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"
          >
            <i class="pi pi-dollar text-lg"></i>
          </div>
        </div>
      </div>

      <!-- 總借出市值 -->
      <div class="apollo-card flex flex-col justify-between h-[130px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-bold text-[var(--text-main)]"
              >總計借券市值 (TWD)</span
            >
            <span
              class="text-[26px] font-black tabular-nums tracking-tight text-orange-500"
            >
              {{ fmtCurrency(totalLoanedTWD, "TWD") }}
            </span>
          </div>
          <div
            class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"
          >
            <i class="pi pi-arrow-right-arrow-left text-lg"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表區 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 台股區塊 -->
      <section v-if="twHoldings.length">
        <div class="flex items-center gap-2 mb-4 px-1">
          <div class="w-1.5 h-5 bg-blue-500 rounded-full"></div>
          <h2 class="text-lg font-bold text-[var(--text-main)] m-0">
            台股 (TW)
          </h2>
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="h in twHoldings"
            :key="h.id"
            class="apollo-card !p-3 sm:!p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all"
          >
            <!-- 左側: 名字與單位 -->
            <div class="flex items-center gap-3 min-w-0 mb-3 sm:mb-0">
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5 min-w-0">
                  <Tag
                    :value="fmtSymbol(h.symbol)"
                    severity="secondary"
                    class="!text-[10px] !py-0.5 !px-1.5 font-mono shrink-0"
                  />
                  <span
                    class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate"
                  >
                    {{ h.name || h.symbol }}
                  </span>
                </div>
                <span
                  class="text-[11px] sm:text-[13px] text-[var(--text-sub)] font-semibold mt-0.5"
                >
                  {{ h.shares }} 股
                  <span
                    v-if="(h.loaned_shares || 0) > 0"
                    class="text-orange-500 ml-1"
                    >(借出 {{ h.loaned_shares }})</span
                  >
                </span>
              </div>
            </div>

            <!-- 右側: 現值與損益 + 按鈕 -->
            <div
              class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-gray-100"
            >
              <div class="flex flex-col sm:items-end">
                <span
                  class="text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--text-main)]"
                >
                  {{ fmtCurrency(calcValue(h), h.currency) }}
                </span>
                <span
                  class="text-[12px] sm:text-[13px] font-bold tabular-nums"
                  :class="
                    calcValue(h) - calcCost(h) >= 0
                      ? 'text-[var(--positive)]'
                      : 'text-[var(--negative)]'
                  "
                >
                  {{ calcValue(h) - calcCost(h) > 0 ? "+" : ""
                  }}{{ fmtCurrency(calcValue(h) - calcCost(h), h.currency) }}
                </span>
              </div>
              <div
                class="flex gap-1 shrink-0 bg-gray-50/50 sm:bg-transparent rounded-lg p-1 sm:p-0"
              >
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="secondary"
                  size="small"
                  @click="openEdit(h as any)"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  size="small"
                  @click="confirmDeleteInvest(h)"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 美股區塊 -->
      <section v-if="usHoldings.length">
        <div class="flex items-center gap-2 mb-4 px-1">
          <div class="w-1.5 h-5 bg-purple-500 rounded-full"></div>
          <h2 class="text-lg font-bold text-[var(--text-main)] m-0">
            美股 (US)
          </h2>
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="h in usHoldings"
            :key="h.id"
            class="apollo-card !p-3 sm:!p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all"
          >
            <!-- 左側: 名字與單位 -->
            <div class="flex items-center gap-3 min-w-0 mb-3 sm:mb-0">
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1.5 min-w-0">
                  <Tag
                    :value="h.symbol"
                    severity="secondary"
                    class="!text-[10px] !py-0.5 !px-1.5 font-mono shrink-0"
                  />
                  <span
                    class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate"
                  >
                    {{ h.name || h.symbol }}
                  </span>
                </div>
                <span
                  class="text-[11px] sm:text-[13px] text-[var(--text-sub)] font-semibold mt-0.5"
                >
                  {{ h.shares }} 股
                  <span
                    v-if="(h.loaned_shares || 0) > 0"
                    class="text-orange-500 ml-1"
                    >(借出 {{ h.loaned_shares }})</span
                  >
                </span>
              </div>
            </div>

            <!-- 右側: 現值與損益 + 按鈕 -->
            <div
              class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-gray-100"
            >
              <div class="flex flex-col sm:items-end">
                <span
                  class="text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--text-main)]"
                >
                  {{ fmtCurrency(calcValue(h), h.currency) }}
                </span>
                <span
                  class="text-[12px] sm:text-[13px] font-bold tabular-nums"
                  :class="
                    calcValue(h) - calcCost(h) >= 0
                      ? 'text-[var(--positive)]'
                      : 'text-[var(--negative)]'
                  "
                >
                  {{ calcValue(h) - calcCost(h) > 0 ? "+" : ""
                  }}{{ fmtCurrency(calcValue(h) - calcCost(h), h.currency) }}
                </span>
              </div>
              <div
                class="flex gap-1 shrink-0 bg-gray-50/50 sm:bg-transparent rounded-lg p-1 sm:p-0"
              >
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="secondary"
                  size="small"
                  @click="openEdit(h as any)"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  size="small"
                  @click="confirmDeleteInvest(h)"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 新增 / 編輯對話框 -->
    <Dialog
      v-model:visible="editVisible"
      :header="isEditing ? '編輯投資' : '新增投資'"
      modal
      :draggable="false"
      :style="{ width: '90vw', maxWidth: '400px' }"
    >
      <div class="flex flex-col gap-1.5">
        <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            v-for="m in marketOptions"
            :key="m.value"
            type="button"
            class="flex-1 py-1.5 text-[13px] font-bold rounded-md transition-all"
            :class="
              editForm.market === m.value
                ? 'bg-white text-[var(--primary)] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            "
            @click="
              editForm.market = m.value;
              onMarketChange();
            "
          >
            {{ m.label }}
          </button>
        </div>
      </div>
      <!-- 股票名稱或代號 -->
      <div class="flex flex-col gap-5 pt-2">
        <div class="flex flex-col gap-1.5 relative">
          <label class="text-[13px] font-bold text-[var(--text-sub)]"
            >股票名稱或代號</label
          >
          <div class="relative w-full">
            <!-- 已選擇：顯示 chip，點 X 可清除重新搜尋 -->
            <div
              v-if="selectedCode"
              class="flex items-center gap-2 px-3 h-10 border border-[var(--line-soft)] rounded-lg bg-white min-w-0"
            >
              <Tag
                :value="selectedCode"
                severity="secondary"
                class="!text-[11px] !py-0.5 !px-1.5 font-mono shrink-0"
              />
              <span
                class="text-sm font-bold text-slate-700 truncate flex-1 min-w-0"
              >
                {{ selectedName }}
              </span>
              <button
                type="button"
                class="shrink-0 text-gray-400 hover:text-gray-600 leading-none"
                @click="editForm.symbol = ''"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>

            <!-- 未選擇：顯示搜尋框 -->
            <AutoComplete
              v-else
              v-model="editForm.symbol"
              :suggestions="searchResults"
              @complete="onSearchStock"
              @item-select="onSymbolSelect"
              :optionLabel="(item) => `${item.code} ${item.name}`"
              placeholder="e.g. AAPL / 0050 / 台積電"
              inputClass="w-full !rounded-lg pr-8"
              class="w-full"
              appendTo="body"
              :pt="{
                panel: { class: 'w-full !max-w-[360px] overflow-hidden' },
              }"
              emptyMessage="找不到符合的項目"
            >
              <template #option="slotProps">
                <div
                  class="flex items-center justify-between gap-2 w-full min-w-0 pr-1"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-14 shrink-0 flex justify-center">
                      <Tag
                        :value="slotProps.option.code"
                        severity="secondary"
                        class="!text-[11px] !py-0.5 !px-1.5 font-mono w-full text-center"
                      />
                    </div>
                    <span
                      class="text-sm font-bold text-slate-700 truncate min-w-0"
                    >
                      {{ slotProps.option.name }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Tag
                      v-if="slotProps.option.exch === 'TAI'"
                      value="上市"
                      severity="info"
                      rounded
                      class="!text-[10px] !py-0 !px-1.5"
                    />
                    <Tag
                      v-else-if="slotProps.option.exch === 'TWO'"
                      value="上櫃"
                      severity="success"
                      rounded
                      class="!text-[10px] !py-0 !px-1.5"
                    />
                    <Tag
                      v-else-if="slotProps.option.exch"
                      :value="String(slotProps.option.exch).substring(0, 4)"
                      severity="secondary"
                      rounded
                      class="!text-[10px] !py-0 !px-1.5"
                    />
                  </div>
                </div>
              </template>
            </AutoComplete>

            <i
              v-if="isSearching"
              class="pi pi-spinner animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none"
            ></i>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]"
              >股數</label
            >
            <InputNumber
              v-model="editForm.shares"
              class="w-full"
              inputClass="w-full !rounded-lg"
              :minFractionDigits="0"
              :maxFractionDigits="4"
              placeholder="0"
              @focus="
                editForm.shares === 0 ? (editForm.shares = null as any) : null
              "
              @blur="editForm.shares === null ? (editForm.shares = 0) : null"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]"
              >成本 ({{ editForm.currency }})</label
            >
            <InputNumber
              v-model="editForm.cost_basis"
              class="w-full"
              inputClass="w-full !rounded-lg"
              :minFractionDigits="0"
              :maxFractionDigits="4"
              placeholder="0"
              @focus="
                editForm.cost_basis === 0
                  ? (editForm.cost_basis = null as any)
                  : null
              "
              @blur="
                editForm.cost_basis === null ? (editForm.cost_basis = 0) : null
              "
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <label class="text-[13px] font-bold text-[var(--text-sub)]"
                >市價 ({{ editForm.currency }})</label
              >
              <i
                v-if="isFetchingPrice"
                class="pi pi-spinner animate-spin text-[var(--primary)] text-sm"
              ></i>
            </div>
            <InputNumber
              v-model="editForm.current_price"
              class="w-full"
              inputClass="w-full !rounded-lg"
              :minFractionDigits="0"
              :maxFractionDigits="4"
              @focus="
                editForm.current_price === 0
                  ? (editForm.current_price = null as any)
                  : null
              "
              @blur="
                editForm.current_price === null
                  ? (editForm.current_price = 0)
                  : null
              "
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]"
              >總市值 ({{ editForm.currency }})</label
            >
            <div
              class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-[9px] w-full text-right font-bold text-gray-700 select-none"
            >
              {{
                fmtCurrency(
                  (editForm.shares || 0) * (editForm.current_price || 0),
                  editForm.currency,
                )
              }}
            </div>
          </div>
        </div>

        <div
          v-if="editHasLoaned"
          class="flex flex-col gap-1.5 bg-orange-50/50 p-3 rounded-lg border border-orange-100 relative mt-2"
        >
          <button
            class="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            @click="
              editHasLoaned = false;
              editForm.loaned_shares = 0;
            "
          >
            <i class="pi pi-times"></i>
          </button>
          <label class="text-[13px] font-bold text-orange-700"
            >已借出股數</label
          >
          <InputNumber
            v-model="editForm.loaned_shares"
            class="w-full"
            inputClass="w-full !rounded-lg !border-orange-200 focus:!border-orange-400"
            :minFractionDigits="0"
            :maxFractionDigits="0"
            placeholder="0"
            @focus="
              editForm.loaned_shares === 0
                ? (editForm.loaned_shares = null as any)
                : null
            "
            @blur="
              editForm.loaned_shares === null
                ? (editForm.loaned_shares = 0)
                : null
            "
          />
        </div>
        <div v-else class="flex justify-start mt-1">
          <Button
            label="新增借券"
            icon="pi pi-plus"
            size="small"
            text
            class="!text-orange-600 hover:!bg-orange-50 !py-1 !px-2"
            @click="editHasLoaned = true"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between gap-2 pt-4 w-full">
          <div class="flex">
            <Button
              v-if="isEditing"
              label="刪除"
              severity="danger"
              text
              @click="removeInvestment"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button
              label="取消"
              severity="secondary"
              text
              @click="editVisible = false"
            />
            <Button label="儲存" severity="primary" @click="saveInvestment" />
          </div>
        </div>
      </template>
    </Dialog>

    <!-- 同步設定對話框 -->
    <Dialog
      v-model:visible="syncVisible"
      header="同步至本月帳戶"
      modal
      :draggable="false"
      :style="{ width: '90vw', maxWidth: '400px' }"
    >
      <div class="flex flex-col gap-4 pt-2">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2"
            >同步範圍</label
          >
          <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              v-for="opt in [
                { label: '全部', value: 'ALL' },
                { label: '僅台股', value: 'TW' },
                { label: '僅美股', value: 'US' },
              ]"
              :key="opt.value"
              class="flex-1 py-1.5 text-[13px] font-bold rounded-md transition-all"
              :class="
                syncMarket === opt.value
                  ? 'bg-white text-[var(--primary)] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              "
              @click="syncMarket = opt.value as 'ALL' | 'TW' | 'US'"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div
          v-if="syncMarket === 'ALL' || syncMarket === 'TW'"
          class="flex flex-col gap-2"
        >
          <label class="text-sm font-bold text-gray-700"
            >台股同步目標帳戶 (覆蓋金額:
            {{ fmtCurrency(twTotalSyncValue, "TWD") }})</label
          >
          <Select
            v-model="syncAccountTW"
            :options="accountOptionsForSyncTW"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇目標帳戶"
            class="w-full"
          />
        </div>

        <div
          v-if="syncMarket === 'ALL' || syncMarket === 'US'"
          class="flex flex-col gap-2"
        >
          <label class="text-sm font-bold text-gray-700"
            >美股同步目標帳戶 (覆蓋金額:
            {{ fmtCurrency(usTotalSyncValue, "USD") }})</label
          >
          <Select
            v-model="syncAccountUS"
            :options="accountOptionsForSyncUS"
            optionLabel="label"
            optionValue="value"
            placeholder="選擇目標帳戶"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="取消"
            severity="secondary"
            text
            @click="syncVisible = false"
          />
          <Button label="確認同步" severity="primary" @click="confirmSync" />
        </div>
      </template>
    </Dialog>
  </div>
</template>
