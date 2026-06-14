<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useIsDesktop } from "../composables/useIsDesktop";
const { isDesktop } = useIsDesktop();
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import AutoComplete from "primevue/autocomplete";
import Tag from "primevue/tag";
import Select from "primevue/select";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import InvestmentTrendChart from "../components/investments/InvestmentTrendChart.vue";
import type { Holding } from "../types";
import type { Currency } from "../types";
import { useAssetManagerStore } from "../stores/assetManager";

type HoldingForm = Omit<Holding, "symbol"> & { symbol: string | any };

import {
  fetchStockPrice,
  searchStocks,
} from "../services/stockApi";
import { initStockCache } from "../services/stockListSync";
import { searchStocksFromCache } from "../services/stockListApi";
import { getCurrentMonth } from "../utils/monthUtils";

const store = useAssetManagerStore();
const toast = useToast();
const confirm = useConfirm();

// ── 狀態 ──
const displayCurrency = ref<"native" | "twd">("native");

// 新增/編輯
const editVisible = ref(false);
const isEditing = ref(false);
const isFetchingPrice = ref(false);
const isSearching = ref(false);
const searchResults = ref<any[]>([]);
const editForm = ref<HoldingForm>({
  id: 0,
  symbol: "",
  market: "TW",
  name: "",
  quantity: 0,
  avgCost: 0,
  currency: "TWD",
  currentPrice: null,
  marketValue: 0,
  gainLoss: 0,
  gainLossPct: null,
  updatedAt: "",
});
let searchTimeout: any = null;

// 同步
const syncVisible = ref(false);
const syncMarket = ref<"ALL" | "TW" | "US">("ALL");
const syncAccountTW = ref("");
const syncAccountUS = ref("");
const isRefreshingAll = ref(false);
const isLoadingTrend = ref(false);

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultInvestmentTrendRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 29);
  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(today),
  };
}

const trendRange = ref<{ startDate?: string; endDate?: string }>(defaultInvestmentTrendRange());

// ── 工具函式 ──
const isSupportedCurrency = (c: string): c is Currency =>
  c === "TWD" || c === "USD" || c === "JPY";

const fmt = (v: number, curr = "TWD") =>
  new Intl.NumberFormat(curr === "TWD" ? "zh-TW" : "en-US", {
    style: "currency",
    currency: curr,
    maximumFractionDigits: curr === "TWD" ? 0 : 2,
  }).format(v);

const fmtCompact = (v: number, curr = "TWD") =>
  new Intl.NumberFormat(curr === "TWD" ? "zh-TW" : "en-US", {
    style: "currency",
    currency: curr,
    notation: "compact",
    maximumFractionDigits: curr === "TWD" ? 1 : 2,
  }).format(v);

const fmtSymbol = (sym: string) => sym.replace(/\.(TW|TWO)$/i, "");

function toTwd(amount: number, currency: string): number {
  return isSupportedCurrency(currency) ? store.toTwd(amount, currency) : amount;
}

// ── 計算邏輯（使用 API 回傳的已計算值，避免前後端不一致） ──
function marketValue(h: Holding): number {
  return h.marketValue;
}

function totalCost(h: Holding): number {
  return h.quantity * h.avgCost;
}

function calcPnl(h: Holding): number {
  return h.gainLoss;
}

function calcPnlRate(h: Holding): number {
  return h.gainLossPct ?? 0;
}

function displayAmount(h: Holding): { amount: number; currency: string; showTwdSub: boolean; twdAmount: number } {
  const native = marketValue(h);
  const twdVal = toTwd(native, h.currency);
  if (displayCurrency.value === "twd") {
    return { amount: twdVal, currency: "TWD", showTwdSub: h.currency !== "TWD", twdAmount: twdVal };
  }
  return { amount: native, currency: h.currency, showTwdSub: h.currency !== "TWD", twdAmount: twdVal };
}

function displayPnl(h: Holding): { amount: number; currency: string } {
  const native = calcPnl(h);
  if (displayCurrency.value === "twd") {
    return { amount: toTwd(native, h.currency), currency: "TWD" };
  }
  return { amount: native, currency: h.currency };
}

// ── 總覽計算 ──
const totalTwd = computed(() =>
  store.holdings.reduce((s, h) => s + toTwd(marketValue(h), h.currency), 0),
);

const totalPnlTwd = computed(() =>
  store.holdings.reduce((s, h) => s + toTwd(calcPnl(h), h.currency), 0),
);

const totalCostTwd = computed(() =>
  store.holdings.reduce((s, h) => s + toTwd(totalCost(h), h.currency), 0),
);

const totalPnlRate = computed(() =>
  totalCostTwd.value === 0 ? 0 : (totalPnlTwd.value / totalCostTwd.value) * 100,
);

function marketSummary(holdings: Holding[], label: string, market: string) {
  const isTw = market === "TW";
  const currency = isTw ? "TWD" : "USD";
  const nativeValue = holdings.reduce((s, h) => s + marketValue(h), 0);
  const nativePnl = holdings.reduce((s, h) => s + calcPnl(h), 0);
  const twdValue = holdings.reduce((s, h) => s + toTwd(marketValue(h), h.currency), 0);
  return {
    label, market, isTw, currency,
    count: holdings.length,
    nativeValue, nativePnl, twdValue,
    allocation: totalTwd.value ? (twdValue / totalTwd.value) * 100 : 0,
  };
}

const summaries = computed(() => [
  marketSummary(store.holdings.filter((h) => h.market === "TW"), "台股", "TW"),
  marketSummary(store.holdings.filter((h) => h.market === "US"), "美股", "US"),
]);

const twItems = computed(() => store.holdings.filter((h) => h.market === "TW"));
const usItems = computed(() => store.holdings.filter((h) => h.market === "US"));

// ── 市場切換 ──
const marketOptions = [
  { label: "台股 (TW)", value: "TW" as const, currency: "TWD" },
  { label: "美股 (US)", value: "US" as const, currency: "USD" },
];

const selectedCode = computed(() => {
  const sym = editForm.value.symbol;
  if (!sym || typeof sym !== "object") return "";
  return (sym as any).code ?? ((sym as any).symbol ?? "").replace(/\.(TW|TWO)$/i, "");
});

const selectedName = computed(() => {
  const sym = editForm.value.symbol;
  if (!sym || typeof sym !== "object") return "";
  return (sym as any).name ?? "";
});

function openAdd(market: "TW" | "US" = "TW") {
  isEditing.value = false;
  editForm.value = {
    id: 0,
    symbol: "",
    market,
    name: "",
    quantity: 0,
    avgCost: 0,
    currency: market === "TW" ? "TWD" : "USD",
    currentPrice: null,
    marketValue: 0,
    gainLoss: 0,
    gainLossPct: null,
    updatedAt: "",
  };
  editVisible.value = true;
}

function openEdit(h: Holding) {
  isEditing.value = true;
  editForm.value = { ...h, symbol: { symbol: h.symbol, name: h.name } as any };
  editVisible.value = true;
}

function onMarketChange() {
  const selected = marketOptions.find((m) => m.value === editForm.value.market);
  if (selected) editForm.value.currency = selected.currency;
  editForm.value.symbol = "";
  editForm.value.name = "";
  editForm.value.quantity = 0;
  editForm.value.avgCost = 0;
  editForm.value.currentPrice = null;
  searchResults.value = [];
}

async function onSearchStock(event: any) {
  if (editForm.value.market === "TW") {
    searchResults.value = searchStocksFromCache(event.query, "TW");
  } else {
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

async function onSymbolSelect(event: any) {
  const selected = event.value;
  if (!selected || !selected.symbol) return;
  const raw = selected.symbol.trim();
  if (raw.endsWith(".TW") || /^\d{4}$/.test(raw)) {
    editForm.value.market = "TW";
    editForm.value.currency = "TWD";
  } else {
    editForm.value.market = "US";
    editForm.value.currency = "USD";
  }
  isFetchingPrice.value = true;
  try {
    const price = await fetchStockPrice(raw);
    if (price !== null) editForm.value.currentPrice = price;
  } finally {
    isFetchingPrice.value = false;
  }
}

async function saveInvestment() {
  let finalSymbol = "";
  let finalName = "";
  const sym = editForm.value.symbol;
  if (typeof sym === "object" && sym !== null) {
    finalSymbol = (sym as any).symbol;
    finalName = (sym as any).name;
  } else {
    finalSymbol = sym as string;
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

async function refreshPrices() {
  isRefreshingAll.value = true;
  try {
    await store.fetchHoldings();
    if (store.holdings.length > 0) {
      const result = await store.takeSnapshot();
      if (result.type === "success") {
        await loadInvestmentTrend(trendRange.value, true);
        toast.add({ severity: "success", summary: "報價更新成功", detail: `已取得最新報價，並建立本次股票資產快照。`, life: 3000 });
      } else {
        toast.add({ severity: "error", summary: "紀錄錯誤", detail: result.message, life: 3000 });
      }
    } else {
      await loadInvestmentTrend(trendRange.value);
    }
  } catch (err: any) {
    toast.add({ severity: "error", summary: "錯誤", detail: err.message || "更新失敗", life: 3000 });
  } finally {
    isRefreshingAll.value = false;
  }
}

async function loadInvestmentTrend(
  range: { startDate?: string; endDate?: string } = trendRange.value,
  preserveCurrentOnEmpty = false,
) {
  trendRange.value = range;
  isLoadingTrend.value = true;
  try {
    await store.fetchInvestmentSnapshots(range.startDate, range.endDate, { preserveCurrentOnEmpty });
  } finally {
    isLoadingTrend.value = false;
  }
}

async function removeInvestment() {
  confirm.require({
    message: "確定要刪除這筆投資嗎？",
    header: "",
    rejectProps: { label: "取消", severity: "secondary", text: true },
    acceptProps: { label: "刪除", severity: "danger" },
    accept: async () => {
      try {
        await store.deleteHolding(editForm.value.id);
        toast.add({ severity: "success", summary: "成功", detail: "投資紀錄已刪除", life: 3000 });
        editVisible.value = false;
      } catch (err: any) {
        toast.add({ severity: "error", summary: "錯誤", detail: err.message || "刪除失敗", life: 3000 });
      }
    },
  });
}

function confirmDeleteInvest(h: Holding) {
  confirm.require({
    message: `確定要刪除「${h.name || h.symbol}」的投資紀錄嗎？`,
    header: "刪除投資",
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "取消", severity: "secondary", outlined: true },
    acceptProps: { label: "刪除", severity: "danger" },
    accept: async () => {
      try {
        await store.deleteHolding(h.id);
        toast.add({ severity: "success", summary: "成功", detail: "投資紀錄已刪除", life: 3000 });
      } catch (err: any) {
        toast.add({ severity: "error", summary: "錯誤", detail: err.message || "刪除失敗", life: 3000 });
      }
    },
  });
}

// ── 同步到每月帳戶 ──
const accountOptionsForSyncTW = computed(() =>
  store.accounts
    .filter((a) => a.type === "asset" && a.currency === "TWD")
    .map((a) => ({ label: a.name, value: a.id })),
);
const accountOptionsForSyncUS = computed(() =>
  store.accounts
    .filter((a) => a.type === "asset" && a.currency === "USD")
    .map((a) => ({ label: a.name, value: a.id })),
);
const twTotalSyncValue = computed(() => twItems.value.reduce((s, h) => s + marketValue(h), 0));
const usTotalSyncValue = computed(() => usItems.value.reduce((s, h) => s + marketValue(h), 0));

function openSync() {
  syncMarket.value = "ALL";
  syncVisible.value = true;
}

async function confirmSync() {
  const entries: Array<{ accountId: string; amount: number }> = [];
  if (syncMarket.value === "ALL" || syncMarket.value === "TW") {
    if (!syncAccountTW.value) {
      toast.add({ severity: "error", summary: "錯誤", detail: "請選擇台股同步目標帳戶", life: 3000 });
      return;
    }
    entries.push({ accountId: syncAccountTW.value, amount: Math.round(twTotalSyncValue.value) });
  }
  if (syncMarket.value === "ALL" || syncMarket.value === "US") {
    if (!syncAccountUS.value) {
      toast.add({ severity: "error", summary: "錯誤", detail: "請選擇美股同步目標帳戶", life: 3000 });
      return;
    }
    entries.push({ accountId: syncAccountUS.value, amount: Math.round(usTotalSyncValue.value) });
  }
  if (entries.length === 0) return;

  try {
    const result = await store.bulkUpsertMonthlyRecords(getCurrentMonth(), entries);
    toast.add({
      severity: result.type === "success" ? "success" : "error",
      summary: result.type === "success" ? "同步成功" : "同步失敗",
      detail: result.message,
      life: 3000,
    });
    if (result.type === "success") syncVisible.value = false;
  } catch (e) {
    toast.add({ severity: "error", summary: "同步錯誤", detail: String(e), life: 3000 });
  }
}

onMounted(() => {
  refreshPrices();
  initStockCache();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-28 relative">
    <!-- ─── Header ─── -->
    <Teleport defer to="#app-header-slot" :disabled="!isDesktop">
      <div
        class="flex items-center justify-between w-full mb-4 px-2"
      >
        <!-- 標題 -->
        <h1 class="text-xl md:text-2xl font-bold text-[var(--text-main)] m-0">投資組合</h1>

        <!-- 操作區 -->
        <div class="flex items-center gap-2 md:gap-3">
          <!-- 報價與同步：電腦版帶文字，手機版僅 Icon -->
          <Button :label="isDesktop ? '更新報價' : ''" icon="pi pi-sync" severity="secondary" rounded :text="isDesktop" :outlined="!isDesktop" size="small" :loading="isRefreshingAll" @click="refreshPrices" :class="isDesktop ? '!px-3 font-bold' : 'w-9 h-9 p-0 bg-white shadow-sm border-[var(--line-soft)]'" />
          <Button :label="isDesktop ? '同步帳戶' : ''" icon="pi pi-cloud-upload" severity="secondary" rounded :text="isDesktop" :outlined="!isDesktop" size="small" @click="openSync" :class="isDesktop ? '!px-3 font-bold' : 'w-9 h-9 p-0 bg-white shadow-sm border-[var(--line-soft)]'" />
        </div>
      </div>
    </Teleport>

    <!-- ─── 總覽區 ─── -->
    <section class="mb-6">
      <div class="flex items-end justify-between">
        <div class="min-w-0">
          <div class="text-[13px] font-bold text-[var(--text-sub)] mb-1">總市值 (TWD)</div>
          <div class="text-[28px] sm:text-[32px] leading-tight font-black tabular-nums tracking-tight text-[var(--text-main)] truncate">
            {{ fmt(totalTwd, "TWD") }}
          </div>
        </div>
        <div class="text-right shrink-0 ml-4">
          <div class="text-[13px] font-bold text-[var(--text-sub)] mb-1">總損益</div>
          <div class="text-[18px] sm:text-[20px] font-black tabular-nums leading-tight" :class="totalPnlTwd >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'">
            {{ totalPnlTwd >= 0 ? "+" : "" }}{{ fmtCompact(totalPnlTwd, "TWD") }}
          </div>
          <div class="text-[12px] font-bold" :class="totalPnlTwd >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'">
            {{ totalPnlRate >= 0 ? "+" : "" }}{{ totalPnlRate.toFixed(1) }}%
          </div>
        </div>
      </div>
    </section>

    <!-- ─── 個股列表 ─── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <section v-for="g in [
        { key: 'TW', title: '台股', color: 'bg-blue-500', list: twItems },
        { key: 'US', title: '美股', color: 'bg-purple-500', list: usItems },
      ]" :key="g.key">
        <div class="flex items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-1.5 h-5 rounded-full" :class="g.color"></div>
            <h2 class="text-lg font-black text-[var(--text-main)] truncate">{{ g.title }}（{{ g.key }}）</h2>
          </div>
          <div class="flex items-center gap-2.5 shrink-0">
            <span class="text-xs font-bold text-[var(--text-sub)]">{{ g.list.length }} 檔</span>
            <Button 
              label="新增" 
              icon="pi pi-plus" 
              size="small" 
              class="!py-1 !px-2.5 !text-[12px] !rounded-lg bg-[var(--primary-soft)] hover:bg-[var(--primary-soft-hover)] text-[var(--primary)] border-none font-bold" 
              @click="openAdd(g.key as 'TW' | 'US')" 
            />
          </div>
        </div>

        <div v-if="!g.list.length" class="text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl">
          尚無{{ g.title }}標的
        </div>

        <div v-else class="apollo-card !p-0 overflow-hidden flex flex-col">
          <article v-for="h in g.list" :key="h.id" 
                   class="flex items-center justify-between py-3 px-3 sm:px-4 border-b border-[var(--line-soft)] last:border-none cursor-pointer hover:bg-[var(--app-bg)] transition-colors"
                   @click="openEdit(h)">
            
            <!-- 左側：代號 Tag + 股票名稱，下方股數 -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2 min-w-0">
                  <Tag 
                    :value="g.key === 'TW' ? fmtSymbol(h.symbol) : h.symbol" 
                    severity="secondary" 
                    class="!text-[11px] !py-0.5 !px-1.5 font-mono shrink-0 !rounded-md" 
                  />
                  <span class="text-[13px] font-bold text-[var(--text-main)] truncate min-w-0">
                    {{ h.name || h.symbol }}
                  </span>
                </div>
                <!-- 股數 -->
                <span class="text-[12px] font-semibold text-[var(--text-muted)] mt-1 ml-0.5">
                  {{ h.quantity }} 股
                </span>
              </div>
            </div>

            <!-- 右側：市值與損益 -->
            <div class="flex flex-col items-end shrink-0 ml-2">
              <span class="text-[15px] font-black tabular-nums text-[var(--text-main)] leading-tight">
                {{ displayAmount(h).amount >= 0 ? "" : "-" }}{{ fmt(Math.abs(displayAmount(h).amount), displayAmount(h).currency) }}
              </span>
              <div class="flex items-center gap-1 mt-0.5 text-[12px] font-bold tabular-nums" :class="calcPnl(h) >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'">
                <span>{{ displayPnl(h).amount >= 0 ? "+" : "" }}{{ fmt(Math.abs(displayPnl(h).amount), displayPnl(h).currency) }}</span>
                <span>({{ calcPnlRate(h) >= 0 ? "+" : "" }}{{ calcPnlRate(h).toFixed(1) }}%)</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <InvestmentTrendChart
      :snapshots="store.investmentSnapshots"
      :usd-to-twd="store.fxRates.USD"
      :loading="isLoadingTrend"
      @range-change="loadInvestmentTrend"
    />

    <!-- ─── 新增/編輯 Dialog ─── -->
    <Dialog v-model:visible="editVisible" :header="isEditing ? '編輯投資' : (editForm.market === 'TW' ? '新增台股' : '新增美股')" modal :draggable="false" :style="{ width: '90vw', maxWidth: '400px' }">
      <div class="flex flex-col gap-5 pt-4">
        <!-- 股票搜尋 -->
        <div class="flex flex-col gap-1.5 relative">
          <label class="text-[13px] font-bold text-[var(--text-sub)]">股票名稱或代號</label>
          <div class="relative w-full">
            <div v-if="selectedCode" class="flex items-center gap-2 px-3 h-10 border border-[var(--line-soft)] rounded-lg bg-white min-w-0">
              <Tag :value="selectedCode" severity="secondary" class="!text-[11px] !py-0.5 !px-1.5 font-mono shrink-0" />
              <span class="text-sm font-bold text-slate-700 truncate flex-1 min-w-0">{{ selectedName }}</span>
              <button type="button" class="shrink-0 text-gray-400 hover:text-gray-600 leading-none" @click="editForm.symbol = ''">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <AutoComplete v-else v-model="editForm.symbol" :suggestions="searchResults" @complete="onSearchStock" @item-select="onSymbolSelect"
              :optionLabel="(item) => `${item.code} ${item.name}`" placeholder="e.g. AAPL / 0050 / 台積電"
              inputClass="w-full !rounded-lg pr-8" class="w-full" appendTo="body"
              :pt="{ panel: { class: 'w-full !max-w-[360px] overflow-hidden' } }" emptyMessage="找不到符合的項目">
              <template #option="slotProps">
                <div class="flex items-center justify-between gap-2 w-full min-w-0 pr-1">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-14 shrink-0 flex justify-center">
                      <Tag :value="slotProps.option.code" severity="secondary" class="!text-[11px] !py-0.5 !px-1.5 font-mono w-full text-center" />
                    </div>
                    <span class="text-sm font-bold text-slate-700 truncate min-w-0">{{ slotProps.option.name }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Tag v-if="slotProps.option.exch === 'TAI'" value="上市" severity="info" rounded class="!text-[10px] !py-0 !px-1.5" />
                    <Tag v-else-if="slotProps.option.exch === 'TWO'" value="上櫃" severity="success" rounded class="!text-[10px] !py-0 !px-1.5" />
                    <Tag v-else-if="slotProps.option.exch" :value="String(slotProps.option.exch).substring(0, 4)" severity="secondary" rounded class="!text-[10px] !py-0 !px-1.5" />
                  </div>
                </div>
              </template>
            </AutoComplete>
            <i v-if="isSearching" class="pi pi-spinner animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary)] pointer-events-none"></i>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]">股數</label>
            <InputNumber v-model="editForm.quantity" class="w-full" inputClass="w-full !rounded-lg" :minFractionDigits="0" :maxFractionDigits="4" placeholder="0"
              @focus="editForm.quantity === 0 ? (editForm.quantity = null as any) : null"
              @blur="editForm.quantity === null ? (editForm.quantity = 0) : null" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]">成本 ({{ editForm.currency }})</label>
            <InputNumber v-model="editForm.avgCost" class="w-full" inputClass="w-full !rounded-lg" :minFractionDigits="0" :maxFractionDigits="4" placeholder="0"
              @focus="editForm.avgCost === 0 ? (editForm.avgCost = null as any) : null"
              @blur="editForm.avgCost === null ? (editForm.avgCost = 0) : null" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <label class="text-[13px] font-bold text-[var(--text-sub)]">市價 ({{ editForm.currency }})</label>
              <i v-if="isFetchingPrice" class="pi pi-spinner animate-spin text-[var(--primary)] text-sm"></i>
            </div>
            <InputNumber v-model="editForm.currentPrice" class="w-full" inputClass="w-full !rounded-lg" :minFractionDigits="0" :maxFractionDigits="4"
              @focus="editForm.currentPrice === 0 ? (editForm.currentPrice = null as any) : null"
              @blur="editForm.currentPrice === null ? (editForm.currentPrice = 0) : null" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]">總市值 ({{ editForm.currency }})</label>
            <div class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-[9px] w-full text-right font-bold text-gray-700 select-none">
              {{ fmt((editForm.quantity || 0) * (editForm.currentPrice || 0), editForm.currency) }}
            </div>
          </div>
        </div>

      </div>

      <template #footer>
        <div class="flex justify-between gap-2 pt-4 w-full">
          <div class="flex">
            <Button v-if="isEditing" label="刪除" severity="danger" text @click="removeInvestment" />
          </div>
          <div class="flex justify-end gap-2">
            <Button label="取消" severity="secondary" text @click="editVisible = false" />
            <Button label="儲存" severity="primary" @click="saveInvestment" />
          </div>
        </div>
      </template>
    </Dialog>

    <!-- ─── 同步 Dialog ─── -->
    <Dialog v-model:visible="syncVisible" header="同步至本月帳戶" modal :draggable="false" :style="{ width: '90vw', maxWidth: '400px' }">
      <div class="flex flex-col gap-4 pt-2">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">同步範圍</label>
          <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button v-for="opt in [{ label: '全部', value: 'ALL' }, { label: '僅台股', value: 'TW' }, { label: '僅美股', value: 'US' }]" :key="opt.value"
              class="flex-1 py-1.5 text-[13px] font-bold rounded-md transition-all"
              :class="syncMarket === opt.value ? 'bg-white text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
              @click="syncMarket = opt.value as 'ALL' | 'TW' | 'US'"
            >{{ opt.label }}</button>
          </div>
        </div>
        <div v-if="syncMarket === 'ALL' || syncMarket === 'TW'" class="flex flex-col gap-2">
          <label class="text-sm font-bold text-gray-700">台股同步目標 (覆蓋 {{ fmt(twTotalSyncValue, "TWD") }})</label>
          <Select v-model="syncAccountTW" :options="accountOptionsForSyncTW" optionLabel="label" optionValue="value" placeholder="選擇目標帳戶" class="w-full" />
        </div>
        <div v-if="syncMarket === 'ALL' || syncMarket === 'US'" class="flex flex-col gap-2">
          <label class="text-sm font-bold text-gray-700">美股同步目標 (覆蓋 {{ fmt(usTotalSyncValue, "USD") }})</label>
          <Select v-model="syncAccountUS" :options="accountOptionsForSyncUS" optionLabel="label" optionValue="value" placeholder="選擇目標帳戶" class="w-full" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" text @click="syncVisible = false" />
          <Button label="確認同步" severity="primary" @click="confirmSync" />
        </div>
      </template>
    </Dialog>
  </div>
</template>
