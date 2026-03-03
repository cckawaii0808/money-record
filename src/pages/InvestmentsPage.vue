<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import ToggleSwitch from "primevue/toggleswitch";
import Checkbox from "primevue/checkbox";
import AutoComplete from "primevue/autocomplete";
import { seedInvestments } from "../data";
import {
  fetchStockPrice,
  fetchMultipleStockPrices,
  searchStocks,
} from "../services/stockApi";

export interface Holding {
  id: string;
  symbol: string | any;
  market: string;
  name: string;
  shares: number | null;
  loaned_shares: number | null;
  cost_basis: number | null;
  current_price: number | null;
  currency: string;
}

// 狀態過濾
const includeLoaned = ref(true);
const mockHoldings = ref<Holding[]>([...seedInvestments]);

// 新增 / 編輯邏輯
const editVisible = ref(false);
const isEditing = ref(false);
const editHasLoaned = ref(false);
const isFetchingPrice = ref(false);

const searchResults = ref<any[]>([]);

const editForm = ref<Holding>({
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

async function onSearchStock(event: any) {
  const query = event.query;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    const rawResults = await searchStocks(query, editForm.value.market);
    searchResults.value = rawResults;
  }, 500);
}

const marketOptions = [
  { label: "台股 (TW)", value: "TW", currency: "TWD" },
  { label: "美股 (US)", value: "US", currency: "USD" },
];

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

function openEdit(h: Holding) {
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

function saveInvestment() {
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

  const payload: Holding = {
    ...editForm.value,
    symbol: finalSymbol,
    name: finalName || finalSymbol, // 若無名稱用代號代替
  };

  if (isEditing.value) {
    const idx = mockHoldings.value.findIndex((h) => h.id === payload.id);
    if (idx !== -1) mockHoldings.value[idx] = payload;
  } else {
    mockHoldings.value.push(payload);
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
  mockHoldings.value.filter((h) => h.market === "TW"),
);
const usHoldings = computed(() =>
  mockHoldings.value.filter((h) => h.market === "US"),
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
  return mockHoldings.value.reduce((acc, h) => {
    let val = calcValue(h);
    if (h.currency === "USD") val *= FX_RATE;
    return acc + val;
  }, 0);
});

const totalPnLTWD = computed(() => {
  return mockHoldings.value.reduce((acc, h) => {
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
    const symbols = mockHoldings.value.map((h) => h.symbol);
    const prices = await fetchMultipleStockPrices(symbols);
    mockHoldings.value.forEach((h) => {
      if (prices[h.symbol] !== undefined) {
        h.current_price = prices[h.symbol];
      }
    });
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
});
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-24 relative">
    <!-- Header: Title & Toggle -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sticky top-0 lg:top-[80px] z-[50] bg-[var(--app-bg)]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-4 sm:py-4 sm:rounded-b-2xl transition-all"
    >
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-[var(--text-main)] m-0">投資組合</h1>
        <Button
          icon="pi pi-sync"
          rounded
          text
          class="!w-8 !h-8 text-[var(--text-sub)] hover:bg-[var(--line-soft)]"
          :class="{ 'animate-spin': isRefreshingAll }"
          @click="refreshPrices"
          title="更新最新報價"
        />
        <Button
          icon="pi pi-plus"
          rounded
          text
          class="!w-8 !h-8 text-[var(--text-sub)] hover:bg-[var(--line-soft)]"
          @click="openAdd"
          title="新增投資"
        />
      </div>

      <div
        class="flex items-center gap-3 bg-[var(--surface)] px-4 py-2 rounded-xl shadow-sm border border-[var(--line-soft)]"
      >
        <span class="text-sm font-semibold text-[var(--text-sub)]"
          >包含借券金額</span
        >
        <ToggleSwitch v-model="includeLoaned" />
      </div>
    </div>

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
            <AutoComplete
              v-model="editForm.symbol"
              :suggestions="searchResults"
              @complete="onSearchStock"
              @item-select="onSymbolSelect"
              optionLabel="symbol"
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
                <div class="flex flex-col gap-0.5 max-w-full min-w-0 pr-2">
                  <div
                    class="flex justify-between items-center w-full gap-2 min-w-0"
                  >
                    <span class="font-bold text-sm truncate shrink min-w-0">{{
                      slotProps.option.name
                    }}</span>
                    <span
                      class="text-[10px] text-slate-500 font-medium shrink-0 bg-slate-100 px-1.5 py-0.5 rounded"
                      >{{ slotProps.option.exch }}</span
                    >
                  </div>
                  <span class="text-[11px] text-slate-400 font-mono truncate">{{
                    slotProps.option.symbol
                  }}</span>
                </div>
              </template>
            </AutoComplete>
            <i
              v-if="isFetchingPrice"
              class="pi pi-spinner animate-spin absolute right-3 top-[18px] -translate-y-[18px] text-gray-400"
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
              >目前市價 ({{ editForm.currency }})</label
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
              >現在市值 ({{ editForm.currency }})</label
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
