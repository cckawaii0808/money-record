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
import PageHeader from "../components/common/PageHeader.vue";
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
import { amountColor, changeColor } from "../utils/valueColors";

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

const fmtSigned = (v: number, curr = "TWD") =>
  `${v > 0 ? "+" : ""}${fmt(v, curr)}`;

const fmtRate = (value: number | null) =>
  value === null || !Number.isFinite(value)
    ? "—"
    : `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

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

function calcPnlRate(h: Holding): number | null {
  const cost = totalCost(h);
  const rate = h.gainLossPct;
  return cost === 0 || !Number.isFinite(cost) || rate === null || !Number.isFinite(rate)
    ? null
    : rate;
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

const totalPnlRate = computed(() => {
  if (totalCostTwd.value === 0 || !Number.isFinite(totalCostTwd.value)) return null;
  const rate = (totalPnlTwd.value / totalCostTwd.value) * 100;
  return Number.isFinite(rate) ? rate : null;
});

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
  <div class="workspace-page investments-page">
    <PageHeader title="投資組合">
        <Button :label="isDesktop ? '更新報價' : ''" aria-label="更新投資報價並建立快照" icon="pi pi-sync" severity="secondary" outlined size="small" :loading="isRefreshingAll" @click="refreshPrices" />
        <Button :label="isDesktop ? '同步帳戶' : ''" aria-label="同步投資市值至本月帳戶" icon="pi pi-cloud-upload" severity="secondary" outlined size="small" @click="openSync" />
    </PageHeader>

    <section class="workspace-panel portfolio-overview" aria-label="投資總覽">
      <div>
        <div class="muted-label">總市值 · TWD</div>
        <div class="portfolio-total" :class="amountColor(totalTwd)">{{ fmt(totalTwd) }}</div>
      </div>
      <div>
        <div class="muted-label">總投入成本 · TWD</div>
        <div class="portfolio-number" :class="amountColor(totalCostTwd)">{{ fmt(totalCostTwd) }}</div>
      </div>
      <div>
        <div class="muted-label">未實現損益 · TWD</div>
        <div class="portfolio-number" :class="changeColor(totalPnlTwd)">{{ fmtSigned(totalPnlTwd) }}</div>
        <div class="text-xs tabular-nums" :class="changeColor(totalPnlRate)">{{ fmtRate(totalPnlRate) }}</div>
      </div>
    </section>

    <div class="holdings-toolbar">
      <span class="section-heading">持倉明細</span>
      <div class="currency-switch" role="group" aria-label="持倉金額顯示幣別">
        <button type="button" :aria-pressed="displayCurrency === 'native'" @click="displayCurrency = 'native'">原幣</button>
        <button type="button" :aria-pressed="displayCurrency === 'twd'" @click="displayCurrency = 'twd'">折台幣</button>
      </div>
    </div>

    <div class="holdings-grid">
      <section v-for="g in summaries" :key="g.market" class="workspace-panel holdings-panel" :aria-label="`${g.label}持倉`">
        <div class="market-heading">
          <div>
            <h2 class="section-heading">{{ g.label }} <span class="currency-badge">{{ g.currency }}</span></h2>
            <p class="muted-label"><span :class="amountColor(g.count)">{{ g.count }}</span> 檔・配置 <span :class="amountColor(g.allocation)">{{ g.allocation.toFixed(1) }}%</span></p>
          </div>
          <Button label="新增" :aria-label="`新增${g.label}投資`" icon="pi pi-plus" size="small" severity="secondary" outlined @click="openAdd(g.market as 'TW' | 'US')" />
        </div>
        <div class="market-total">
          <strong :class="amountColor(displayCurrency === 'twd' ? g.twdValue : g.nativeValue)">{{ fmt(displayCurrency === 'twd' ? g.twdValue : g.nativeValue, displayCurrency === 'twd' ? 'TWD' : g.currency) }}</strong>
          <span class="muted-label">{{ displayCurrency === 'twd' ? '折台幣市值' : '原幣市值' }}</span>
        </div>
        <div v-if="!g.count" class="holdings-empty">
          <p>尚無{{ g.label }}標的</p>
          <span class="muted-label">新增持倉後即可追蹤市值與損益。</span>
        </div>
        <div v-else class="holdings-table-wrap" tabindex="0" :aria-label="`${g.label}持倉表格，可橫向捲動`">
          <table class="data-table holdings-table">
            <caption class="sr-only">{{ g.label }}持倉；市值與損益以{{ displayCurrency === 'twd' ? '台幣' : '原幣' }}顯示</caption>
            <thead><tr><th scope="col">標的／股數</th><th scope="col">市值／損益</th><th scope="col">操作</th></tr></thead>
            <tbody>
              <tr v-for="h in (g.market === 'TW' ? twItems : usItems)" :key="h.id">
                <td>
                  <button type="button" class="holding-name" :aria-label="`編輯 ${h.name || h.symbol} 投資`" @click="openEdit(h)">
                    <span class="holding-symbol">{{ fmtSymbol(h.symbol) }}</span>
                    <span>{{ h.name || h.symbol }}</span>
                  </button>
                  <div class="holding-detail"><span :class="amountColor(h.quantity)">{{ h.quantity.toLocaleString('zh-TW') }}</span> 股・{{ h.currency }}</div>
                  <div class="holding-detail">成本 <span :class="amountColor(h.avgCost)">{{ fmt(h.avgCost, h.currency) }}</span>／市價 <span :class="amountColor(h.currentPrice)">{{ h.currentPrice === null ? '—' : fmt(h.currentPrice, h.currency) }}</span></div>
                </td>
                <td class="holding-value">
                  <strong :class="amountColor(displayAmount(h).amount)">{{ fmt(displayAmount(h).amount, displayAmount(h).currency) }}</strong>
                  <div v-if="displayAmount(h).showTwdSub" class="holding-detail">
                    {{ displayCurrency === 'twd' ? `原幣 ${h.currency}` : '約 TWD' }}
                    <span :class="amountColor(displayCurrency === 'twd' ? h.marketValue : displayAmount(h).twdAmount)">{{ displayCurrency === 'twd' ? fmt(h.marketValue, h.currency) : fmt(displayAmount(h).twdAmount) }}</span>
                  </div>
                  <div :class="changeColor(calcPnl(h))">
                    {{ fmtSigned(displayPnl(h).amount, displayPnl(h).currency) }}
                    <span class="holding-rate" :class="changeColor(calcPnlRate(h))">{{ fmtRate(calcPnlRate(h)) }}</span>
                  </div>
                </td>
                <td>
                  <div class="flex gap-1">
                    <Button icon="pi pi-pencil" :aria-label="`編輯 ${h.name || h.symbol} 投資`" severity="secondary" text size="small" @click="openEdit(h)" />
                    <Button icon="pi pi-trash" :aria-label="`刪除 ${h.name || h.symbol} 投資`" severity="danger" text size="small" @click="confirmDeleteInvest(h)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
      <div class="investment-form flex flex-col gap-4 pt-2">
        <div v-if="!isEditing" class="flex flex-col gap-1.5">
          <label for="holding-market" class="muted-label">投資市場</label>
          <Select inputId="holding-market" v-model="editForm.market" :options="marketOptions" optionLabel="label" optionValue="value" @change="onMarketChange" />
        </div>
        <!-- 股票搜尋 -->
        <div class="flex flex-col gap-1.5 relative">
          <label for="holding-symbol" class="text-[13px] font-bold text-[var(--text-sub)]">股票名稱或代號</label>
          <div class="relative w-full">
            <div v-if="selectedCode" class="flex items-center gap-2 px-3 h-10 border border-[var(--line-soft)] rounded-lg bg-[var(--surface)] min-w-0">
              <Tag :value="selectedCode" severity="secondary" class="!text-[11px] !py-0.5 !px-1.5 font-mono shrink-0" />
              <span class="text-sm font-semibold text-[var(--text-main)] truncate flex-1 min-w-0">{{ selectedName }}</span>
              <button type="button" aria-label="清除已選股票，重新搜尋" class="shrink-0 text-[var(--text-sub)] leading-none" @click="editForm.symbol = ''">
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <AutoComplete v-else inputId="holding-symbol" v-model="editForm.symbol" :suggestions="searchResults" @complete="onSearchStock" @item-select="onSymbolSelect"
              :optionLabel="(item) => `${item.code ?? fmtSymbol(item.symbol)} ${item.name}`" placeholder="例如：AAPL／0050／台積電"
              inputClass="w-full !rounded-lg pr-8" class="w-full" appendTo="body"
              :pt="{ panel: { class: 'w-full !max-w-[360px] overflow-hidden' } }" emptyMessage="找不到符合的項目">
              <template #option="slotProps">
                <div class="flex items-center justify-between gap-2 w-full min-w-0 pr-1">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-14 shrink-0 flex justify-center">
                      <Tag :value="slotProps.option.code" severity="secondary" class="!text-[11px] !py-0.5 !px-1.5 font-mono w-full text-center" />
                    </div>
                    <span class="text-sm font-semibold text-[var(--text-main)] truncate min-w-0">{{ slotProps.option.name }}</span>
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
            <label for="holding-quantity" class="text-[13px] font-bold text-[var(--text-sub)]">股數</label>
            <InputNumber inputId="holding-quantity" v-model="editForm.quantity" class="w-full" :inputClass="`w-full !rounded-lg ${amountColor(editForm.quantity)}`" :minFractionDigits="0" :maxFractionDigits="4" placeholder="0"
              @focus="editForm.quantity === 0 ? (editForm.quantity = null as any) : null"
              @blur="editForm.quantity === null ? (editForm.quantity = 0) : null" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="holding-cost" class="text-[13px] font-bold text-[var(--text-sub)]">每股成本（{{ editForm.currency }}）</label>
            <InputNumber inputId="holding-cost" v-model="editForm.avgCost" class="w-full" :inputClass="`w-full !rounded-lg ${amountColor(editForm.avgCost)}`" :minFractionDigits="0" :maxFractionDigits="4" placeholder="0"
              @focus="editForm.avgCost === 0 ? (editForm.avgCost = null as any) : null"
              @blur="editForm.avgCost === null ? (editForm.avgCost = 0) : null" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <label for="holding-price" class="text-[13px] font-bold text-[var(--text-sub)]">市價（{{ editForm.currency }}）</label>
              <i v-if="isFetchingPrice" class="pi pi-spinner animate-spin text-[var(--primary)] text-sm"></i>
            </div>
            <InputNumber inputId="holding-price" v-model="editForm.currentPrice" class="w-full" :inputClass="`w-full !rounded-lg ${amountColor(editForm.currentPrice)}`" :minFractionDigits="0" :maxFractionDigits="4"
              @focus="editForm.currentPrice === 0 ? (editForm.currentPrice = null as any) : null"
              @blur="editForm.currentPrice === null ? (editForm.currentPrice = 0) : null" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-bold text-[var(--text-sub)]">總市值 ({{ editForm.currency }})</label>
            <div class="bg-[var(--app-bg)] border border-[var(--line-soft)] rounded-lg px-3 py-[9px] w-full text-right font-semibold tabular-nums select-none" :class="amountColor((editForm.quantity || 0) * (editForm.currentPrice || 0))">
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
      <div class="investment-form flex flex-col gap-4 pt-2">
        <p class="muted-label">以原幣市值覆蓋 {{ getCurrentMonth() }} 的目標帳戶記錄：台股為 TWD，美股為 USD。</p>
        <div>
          <span class="block text-sm font-semibold text-[var(--text-sub)] mb-2">同步範圍</span>
          <div class="currency-switch flex" role="group" aria-label="同步市場範圍">
            <button v-for="opt in [{ label: '全部', value: 'ALL' }, { label: '僅台股', value: 'TW' }, { label: '僅美股', value: 'US' }]" :key="opt.value"
              type="button" class="flex-1" :aria-pressed="syncMarket === opt.value"
              @click="syncMarket = opt.value as 'ALL' | 'TW' | 'US'"
            >{{ opt.label }}</button>
          </div>
        </div>
        <div v-if="syncMarket === 'ALL' || syncMarket === 'TW'" class="flex flex-col gap-2">
          <label for="sync-account-tw" class="text-sm font-semibold text-[var(--text-sub)]">台股目標（覆蓋 <span :class="amountColor(twTotalSyncValue)">{{ fmt(twTotalSyncValue, "TWD") }}</span>）</label>
          <Select inputId="sync-account-tw" v-model="syncAccountTW" :options="accountOptionsForSyncTW" optionLabel="label" optionValue="value" placeholder="選擇 TWD 資產帳戶" class="w-full" />
          <router-link v-if="!accountOptionsForSyncTW.length" to="/records" class="text-sm text-[var(--primary)]">前往每月記錄新增 TWD 帳戶</router-link>
        </div>
        <div v-if="syncMarket === 'ALL' || syncMarket === 'US'" class="flex flex-col gap-2">
          <label for="sync-account-us" class="text-sm font-semibold text-[var(--text-sub)]">美股目標（覆蓋 <span :class="amountColor(usTotalSyncValue)">{{ fmt(usTotalSyncValue, "USD") }}</span>）</label>
          <Select inputId="sync-account-us" v-model="syncAccountUS" :options="accountOptionsForSyncUS" optionLabel="label" optionValue="value" placeholder="選擇 USD 資產帳戶" class="w-full" />
          <router-link v-if="!accountOptionsForSyncUS.length" to="/records" class="text-sm text-[var(--primary)]">前往每月記錄新增 USD 帳戶</router-link>
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

<style scoped>
.investments-page { color: var(--text-main); }
.investment-intro { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.investment-intro h1 { margin: 0 0 6px; font-size: 24px; font-weight: 650; }
.investment-intro p, .holdings-toolbar p, .market-heading p { margin: 0; font-size: 12px; line-height: 1.6; }
.portfolio-overview { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; padding: 0; }
.portfolio-overview > div { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; min-width: 0; }
.portfolio-overview > div + div { border-left: 1px solid var(--line-soft); }
.portfolio-overview .muted-label { font-size: 13px; line-height: 20px; }
.portfolio-total, .portfolio-number { font-size: 26px; line-height: 1.25; font-weight: 650; margin: 0; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.text-main, :deep(.text-main) { color: var(--text-main); }
.holdings-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 20px 0 12px; }
.currency-switch { display: inline-flex; padding: 3px; border: 1px solid var(--line-soft); border-radius: 6px; background: var(--app-bg); flex-shrink: 0; }
.currency-switch button { border: 0; border-radius: 4px; padding: 6px 12px; background: transparent; color: var(--text-sub); font: inherit; font-size: 12px; cursor: pointer; }
.currency-switch button[aria-pressed="true"] { background: var(--surface); color: var(--text-main); box-shadow: 0 1px 2px rgb(0 0 0 / 4%); }
.holdings-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.holdings-panel { min-width: 0; overflow: hidden; padding: 0; }
.market-heading { padding: 16px 16px 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.market-heading h2 { margin: 0 0 4px; font-size: 15px; font-weight: 600; }
.market-total { display: flex; gap: 8px; align-items: baseline; padding: 0 16px 14px; }
.market-total strong { font-size: 20px; font-weight: 600; font-variant-numeric: tabular-nums; }
.market-total span { font-size: 11px; }
.holdings-empty { padding: 28px 16px; border-top: 1px solid var(--line-soft); text-align: center; font-size: 13px; }
.holdings-empty p { margin: 0 0 6px; }
.holdings-table-wrap { overflow-x: auto; }
.holdings-table { width: 100%; border-collapse: collapse; font-size: 15px; }
.holdings-table th { padding: 8px 12px; background: var(--app-bg); color: var(--text-sub); text-align: left; font-weight: 500; white-space: nowrap; }
.holdings-table td { padding: 12px; border-top: 1px solid var(--line-soft); vertical-align: top; }
.holdings-table th:nth-child(2) { text-align: right; }
.holdings-table th:last-child { width: 76px; }
.holding-name { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; border: 0; background: none; color: var(--text-main); padding: 0; font: inherit; font-weight: 600; text-align: left; cursor: pointer; }
.holding-symbol { font-size: 11px; color: var(--text-sub); font-variant-numeric: tabular-nums; }
.holding-detail { color: var(--text-sub); font-size: 13px; line-height: 1.6; margin-top: 3px; }
.holding-value { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
.holding-value strong { display: block; font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.holding-rate { display: block; font-size: 11px; margin-top: 2px; }
.investment-form :deep(.p-inputnumber-input) { min-width: 0; }
button:focus-visible, .holdings-table-wrap:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
@media (max-width: 1100px) { .holdings-grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 640px) {
  .investment-intro { align-items: flex-start; gap: 8px; }
  .investment-intro h1 { font-size: 22px; }
  .portfolio-overview { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .portfolio-overview > div { padding: 14px; }
  .portfolio-overview > div:nth-child(2) { border-left: 0; }
  .portfolio-overview > div:not(:first-child) { border-top: 1px solid var(--line-soft); }
  .portfolio-overview > div:first-child { grid-column: 1 / -1; }
  .portfolio-total, .portfolio-number { font-size: 22px; }
  .holdings-toolbar { align-items: flex-start; }
  .holdings-table { min-width: 430px; }
}
</style>
