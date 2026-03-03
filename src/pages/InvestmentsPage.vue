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
import type { Holding } from "../types";
import { useAssetManagerStore } from "../stores/assetManager";

// AutoComplete 選取時 symbol 暫時為 object，故表單型別獨立定義
type HoldingForm = Omit<Holding, "symbol"> & { symbol: string | any };
import {
  fetchStockPrice,
  fetchMultipleStockPrices,
} from "../services/stockApi";
import { initStockCache } from "../services/stockListSync";
import { searchStocksFromCache } from "../services/stockListApi";

const store = useAssetManagerStore();

// 狀態過濾
const includeLoaned = ref(true);

// 新增 / 編輯邏輯
const editVisible = ref(false);
const isEditing = ref(false);
const editHasLoaned = ref(false);
const isFetchingPrice = ref(false);

const searchResults = ref<any[]>([]);

const editForm = ref<HoldingForm>({
  id: "",
  symbol: "",
  market: "TW",
  name: "",
  shares: null,
  loaned_shares: null,
  cost_basis: null,
  current_price: null,
  currency: "TWD",
});

let searchTimeout: any = null;

/**
 * 搜尋股票：優先從記憶體快取即時搜尋（無延遲），
 * 若快取尚未就緒才 fallback 到 Yahoo Finance API。
 */
function onSearchStock(event: any) {
  searchResults.value = searchStocksFromCache(
    event.query,
    editForm.value.market,
  );
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
      current_price: null,
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
  editForm.value.current_price = null;
  editHasLoaned.value = false;
  searchResults.value = [];
}

async function saveInvestment() {
  const shares = editForm.value.shares || 0;
  const loaned = editForm.value.loaned_shares || 0;
  if (loaned > shares) {
    alert("借出股數不能大於持有股數");
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

  // 背景嘗試升級至 Supabase 資料（不阻塞頁面，搜尋功能即時可用）
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            class="apollo-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:-translate-y-[1px] hover:border-[var(--primary)] transition-all"
            @click="openEdit(h)"
          >
            <!-- 左側: 名字與單位 -->
            <div class="flex items-center gap-3 min-w-0 mb-3 sm:mb-0">
              <div
                class="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-sm bg-blue-600"
              >
                {{ h.symbol.charAt(0) }}
              </div>
              <div class="flex flex-col min-w-0">
                <span
                  class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate max-w-[150px]"
                >
                  {{ h.name || h.symbol }}
                </span>
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

            <!-- 右側: 現值與損益 -->
            <div class="flex flex-col items-end shrink-0 ml-2">
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
            class="apollo-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:-translate-y-[1px] hover:border-[var(--primary)] transition-all"
            @click="openEdit(h)"
          >
            <!-- 左側: 名字與單位 -->
            <div class="flex items-center gap-3 min-w-0 mb-3 sm:mb-0">
              <div
                class="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-sm bg-purple-600"
              >
                {{ h.symbol.charAt(0) }}
              </div>
              <div class="flex flex-col min-w-0">
                <span
                  class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate max-w-[150px]"
                >
                  {{ h.name || h.symbol }}
                </span>
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

            <!-- 右側: 現值與損益 -->
            <div class="flex flex-col items-end shrink-0 ml-2">
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
                  <div class="flex items-center gap-2 min-w-0">
                    <Tag
                      :value="slotProps.option.code"
                      severity="secondary"
                      class="!text-[11px] !py-0.5 !px-1.5 font-mono"
                    />
                    <span
                      class="text-sm font-bold text-slate-700 truncate min-w-0"
                    >
                      {{ slotProps.option.name }}
                    </span>
                  </div>
                  <Tag
                    :value="slotProps.option.exch === 'TAI' ? '上市' : '上櫃'"
                    :severity="
                      slotProps.option.exch === 'TAI' ? 'info' : 'success'
                    "
                    rounded
                    class="!text-[10px] !py-0 !px-1.5"
                  />
                </div>
              </template>
            </AutoComplete>

            <i
              v-if="isFetchingPrice"
              class="pi pi-spinner animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
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
            <label class="text-[13px] font-bold text-[var(--text-sub)]"
              >市價 ({{ editForm.currency }})</label
            >
            <InputNumber
              v-model="editForm.current_price"
              class="w-full"
              inputClass="w-full !rounded-lg bg-gray-50 text-gray-500 border-gray-200"
              :minFractionDigits="0"
              :maxFractionDigits="4"
              disabled
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
          class="flex flex-col gap-1.5 bg-orange-50/50 p-3 rounded-lg border border-orange-100"
        >
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
      </div>

      <template #footer>
        <div class="flex justify-end gap-2 pt-4">
          <Button
            label="取消"
            severity="secondary"
            text
            @click="editVisible = false"
          />
          <Button label="儲存" severity="primary" @click="saveInvestment" />
        </div>
      </template>
    </Dialog>
  </div>
</template>
