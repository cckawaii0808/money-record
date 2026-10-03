<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Skeleton from "primevue/skeleton";
import { useIsDesktop } from "../composables/useIsDesktop";
import { useAssetManagerStore } from "../stores";
import { formatDecimal, formatTwd } from "../utils/formatters";
import DashboardKpiCard from "../components/dashboard/DashboardKpiCard.vue";
import AssetDonutChart from "../components/dashboard/AssetDonutChart.vue";
import type { DonutItem } from "../components/dashboard/AssetDonutChart.vue";
import NetWorthTrendChart from "../components/dashboard/NetWorthTrendChart.vue";
import PageHeader from "../components/common/PageHeader.vue";
import MonthNavigator from "../components/common/MonthNavigator.vue";
import Button from "primevue/button";
import { amountColor } from "../utils/valueColors";

const { isDesktop } = useIsDesktop();
const store = useAssetManagerStore();
const router = useRouter();
const { accounts, records, isLoading, selectedMonth, months } = storeToRefs(store);
// 首頁固定呈現全部帳戶，避免其他頁的帳戶篩選改變總資產。
const accountRows = computed(() => accounts.value.map((account) => {
  const current = store.amountAtMonth(account.id, selectedMonth.value);
  const amountTwd = store.toTwd(current, account.currency);
  return { ...account, current, amountTwd };
}));
const historyMonths = computed(() => {
  const ids = new Set(accounts.value.map((account) => account.id));
  const recorded = records.value.filter((record) => ids.has(record.accountId) && record.month <= selectedMonth.value).map((record) => record.month);
  return [...new Set(recorded)].sort();
});
const comparisonMonth = computed(() => historyMonths.value.filter((month) => month < selectedMonth.value).at(-1) ?? null);
const hasData = computed(() => historyMonths.value.length > 0);
const totals = computed(() => accountRows.value.reduce((result, row) => {
  result[row.type] += row.amountTwd;
  return result;
}, { asset: 0, liability: 0 }));
const netWorth = computed(() => totals.value.asset - totals.value.liability);
const previousNet = computed(() => comparisonMonth.value === null ? null : accounts.value.reduce((sum, account) => {
  const value = store.toTwd(store.amountAtMonth(account.id, comparisonMonth.value!), account.currency);
  return sum + (account.type === "asset" ? value : -value);
}, 0));
const delta = computed(() => previousNet.value === null ? null : netWorth.value - previousNet.value);
const deltaPct = computed(() => previousNet.value === null || previousNet.value === 0 || delta.value === null ? null : delta.value / Math.abs(previousNet.value) * 100);
function signedTwd(value: number) { return `${value > 0 ? '+' : ''}${formatTwd(value)}`; }
const trendRows = computed(() => {
  const ids = new Set(accounts.value.map((account) => account.id));
  const first = records.value.filter((record) => ids.has(record.accountId)).map((record) => record.month).sort()[0];
  if (!first) return [];
  const calendarMonths: string[] = [];
  const [year, month] = first.split("-").map(Number);
  const cursor = new Date(year, month - 1, 1);
  const last = months.value.at(-1) ?? selectedMonth.value;
  while (true) {
    const value = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    if (value > last) break;
    calendarMonths.push(value);
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return calendarMonths.map((month) => {
    let assetTwd = 0;
    let liabilityTwd = 0;
    for (const account of accounts.value) {
      const value = store.toTwd(store.amountAtMonth(account.id, month), account.currency);
      if (account.type === "asset") assetTwd += value;
      else liabilityTwd += value;
    }
    return { month, assetTwd, liabilityTwd, netTwd: assetTwd - liabilityTwd };
  });
});
const allocation = computed<DonutItem[]>(() => accountRows.value.filter((row) => row.type === "asset").map((row) => ({
  id: row.id, accountName: row.name, category: row.category, currency: row.currency,
  current: row.current, netImpactTwd: row.amountTwd,
})));
const updatedIds = computed(() => new Set(records.value.filter((record) => record.month === selectedMonth.value).map((record) => record.accountId)));
const updatedCount = computed(() => accounts.value.filter((account) => updatedIds.value.has(account.id)).length);
const pendingAccounts = computed(() => accountRows.value.filter((row) => !updatedIds.value.has(row.id)).map((row) => {
  const lastMonth = records.value.filter((record) => record.accountId === row.id && record.month < selectedMonth.value).map((record) => record.month).sort().at(-1);
  return { ...row, lastMonth };
}));
const progress = computed(() => accounts.value.length ? updatedCount.value / accounts.value.length * 100 : 0);
const debtRatio = computed(() => hasData.value && totals.value.asset > 0 ? totals.value.liability / totals.value.asset * 100 : null);
function openRecords(accountIds?: string[]) {
  void router.push({ path: "/records", query: accountIds?.length ? { account: accountIds.join(",") } : {} });
}
</script>

<template>
  <div class="workspace-page dashboard-page" :class="{ 'dashboard-page--desktop': isDesktop }">
    <PageHeader title="資產總覽">
      <MonthNavigator :modelValue="selectedMonth" :months="months" @update:modelValue="selectedMonth = $event" />
      <template #extra><Button label="更新紀錄" icon="pi pi-arrow-up-right" size="small" @click="openRecords()" /></template>
    </PageHeader>

    <DashboardKpiCard :loading="isLoading" :net-worth="formatTwd(netWorth)" :total-asset="formatTwd(totals.asset)" :total-liability="formatTwd(totals.liability)" :net-worth-value="netWorth" :total-asset-value="totals.asset" :total-liability-value="totals.liability" :delta="delta === null ? undefined : signedTwd(delta)" :delta-value="delta ?? undefined" :delta-pct="deltaPct" :comparison-month="comparisonMonth" />

    <div class="overview-grid">
      <NetWorthTrendChart :trend-rows="trendRows" :selected-month="selectedMonth" :loading="isLoading" @select-month="selectedMonth = $event" />
      <AssetDonutChart :items="allocation" :month="selectedMonth" :loading="isLoading" @open-records="openRecords" />
    </div>

    <div class="detail-grid">
      <section class="workspace-panel detail-panel debt-panel" :aria-busy="isLoading">
        <h2 class="section-heading">債務比例水位</h2>
        <Skeleton v-if="isLoading" width="100%" height="100px" />
        <template v-else>
          <strong class="ratio-value" :class="amountColor(debtRatio)">{{ debtRatio === null ? '—' : `${debtRatio.toFixed(1)}%` }}</strong>
          <div class="level-track" role="img" :aria-label="debtRatio === null ? '無法計算債務比例' : `負債占資產 ${debtRatio.toFixed(1)}%`"><span :style="{ width: `${Math.min(100, Math.max(0, debtRatio ?? 0))}%` }" /></div>
          <div class="level-labels"><span>0%</span><span>100%</span></div>
          <dl class="debt-totals"><div><dt>資產</dt><dd>{{ formatTwd(totals.asset) }}</dd></div><div><dt>負債</dt><dd>{{ formatTwd(totals.liability) }}</dd></div></dl>
        </template>
      </section>

      <section class="workspace-panel detail-panel update-panel" :aria-busy="isLoading">
        <div class="toolbar panel-heading"><h2 class="section-heading">本月更新進度</h2><span class="muted-label">{{ selectedMonth }}</span></div>
        <Skeleton v-if="isLoading" width="100%" height="180px" />
        <template v-else>
          <div class="progress-heading"><strong>{{ updatedCount }}<small> / {{ accounts.length }} 帳戶</small></strong><span class="muted-label">{{ progress.toFixed(0) }}%</span></div>
          <div class="level-track progress-track" role="progressbar" aria-label="所選月份已更新帳戶" :aria-valuenow="updatedCount" :aria-valuemin="0" :aria-valuemax="accounts.length || 1"><span :style="{ width: `${progress}%` }" /></div>
          <p v-if="!accounts.length" class="empty-state">尚無帳戶，請先至<RouterLink to="/records">每月記錄新增帳戶</RouterLink>。</p>
          <p v-else-if="!pendingAccounts.length" class="complete-note">所有帳戶皆已有 {{ selectedMonth }} 紀錄。</p>
          <div v-else class="pending-list">
            <button v-for="account in pendingAccounts" :key="account.id" type="button" class="pending-row" @click="openRecords([account.id])"><span>{{ account.name }}<small>{{ account.lastMonth ? `沿用 ${account.lastMonth}` : '尚未記錄' }}</small></span><span class="muted-label">更新 ↗</span></button>
          </div>
           <button v-if="pendingAccounts.length" type="button" class="text-button" @click="router.push({ path: '/records', query: { pending: '1' } })">更新全部待補帳戶 →</button>
        </template>
      </section>
    </div>

    <footer class="fx-note">
      <span class="currency-badge">TWD</span>
      <span>1 USD = {{ formatDecimal(store.fxRates.USD) }} TWD・1 JPY = {{ formatDecimal(store.fxRates.JPY) }} TWD</span>
      <span>{{ store.fxUpdatedAt ? `匯率更新：${store.fxUpdatedLabel}` : '匯率尚未取得更新時間，使用預設換算值' }}{{ store.fxError ? '・更新失敗，沿用現有匯率' : '' }}</span>
    </footer>
  </div>
</template>

<style scoped>
.dashboard-page { color: var(--text-main); }
.dashboard-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.dashboard-header h1 { font-size: 24px; font-weight: 650; margin: 0; }
.dashboard-header p { margin: 5px 0 0; font-size: 14px; }
.header-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.month-navigation { display: flex; align-items: center; border: 1px solid var(--line-soft); border-radius: 6px; background: var(--surface); }
.month-navigation button, .month-navigation select { background: transparent; color: var(--text-main); border: 0; height: 34px; padding: 0 10px; cursor: pointer; }
.month-navigation button { font-size: 22px; }
.month-navigation button:disabled { color: var(--text-muted); cursor: default; }
.month-navigation select { font-size: 14px; }
.month-navigation option { background: var(--surface); color: var(--text-main); }
.action-button { padding: 8px 12px; background: var(--primary); color: var(--surface); border: 1px solid var(--primary); border-radius: 6px; font-size: 14px; cursor: pointer; }
.data-note { font-size: 13px; color: var(--text-sub); margin: 9px 0 16px; line-height: 1.6; }
.overview-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 16px; align-items: stretch; margin-top: 18px; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 16px; align-items: stretch; }
.detail-panel { min-width: 0; padding: 18px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line-soft); box-shadow: none; }
.panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.panel-heading > span { font-size: 13px; }
.panel-description, .panel-footnote { margin: 8px 0 12px; font-size: 13px; line-height: 1.6; color: var(--text-sub); }
.panel-footnote { margin: 12px 0 0; }
.empty-state { padding: 22px 0; color: var(--text-sub); font-size: 12px; line-height: 1.7; }
.movement-row { display: flex; gap: 10px; align-items: center; width: 100%; border: 0; border-bottom: 1px solid var(--line-soft); background: transparent; text-align: left; padding: 11px 0; cursor: pointer; color: var(--text-main); }
.movement-account { flex: 1; min-width: 0; }
.movement-account strong, .movement-account small, .movement-value strong, .movement-value small { display: block; }
.movement-account strong { font-size: 15px; font-weight: 550; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.movement-account small, .movement-value small { font-size: 12px; color: var(--text-sub); margin-top: 4px; }
.movement-value { text-align: right; font-variant-numeric: tabular-nums; }
.movement-value strong { font-size: 15px; font-weight: 550; }
.positive { color: var(--positive); }
.negative { color: var(--negative); }
.ratio-value { display: block; font-size: 30px; font-weight: 600; margin: 12px 0 16px; font-variant-numeric: tabular-nums; }
.level-track { height: 6px; background: var(--app-bg); border-radius: 3px; overflow: hidden; }
.level-track > span { display: block; height: 100%; background: var(--text-sub); }
.level-labels { display: flex; justify-content: space-between; color: var(--text-sub); font-size: 10px; margin-top: 5px; }
.debt-totals { margin: 18px 0 0; font-size: 12px; }
.debt-totals > div { display: flex; justify-content: space-between; gap: 8px; margin-top: 8px; }
.debt-totals dt { color: var(--text-sub); }
.debt-totals dd { margin: 0; font-variant-numeric: tabular-nums; }
.progress-heading { display: flex; align-items: baseline; justify-content: space-between; margin: 16px 0 10px; }
.progress-heading strong { font-size: 24px; font-weight: 600; }
.progress-heading small { font-size: 12px; color: var(--text-sub); font-weight: 400; }
.progress-track > span { background: var(--primary); }
.pending-list { max-height: 168px; overflow-y: auto; }
.pending-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; width: 100%; padding: 9px 0; background: transparent; border: 0; border-bottom: 1px solid var(--line-soft); color: var(--text-main); font-size: 14px; text-align: left; cursor: pointer; }
.pending-row > span:first-child { min-width: 0; overflow-wrap: anywhere; }
.pending-row > span:last-child { white-space: nowrap; font-size: 11px; }
.pending-row small { display: block; color: var(--text-sub); font-size: 12px; margin-top: 3px; }
.complete-note { color: var(--primary); font-size: 12px; padding: 16px 0; }
.text-button { border: 0; background: transparent; color: var(--primary); font-size: 12px; padding: 12px 0 0; cursor: pointer; }
.fx-note { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; color: var(--text-sub); font-size: 12px; line-height: 1.7; margin-top: 16px; }
button:focus-visible, select:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.movement-row:hover, .pending-row:hover { background: var(--app-bg); }
@media (max-width: 1100px) { .detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .movement-panel { grid-column: 1 / -1; } }
@media (max-width: 760px) {
  .dashboard-header { gap: 12px; }
  .dashboard-header h1 { font-size: 21px; }
  .header-actions { width: 100%; justify-content: space-between; }
  .overview-grid, .detail-grid { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .detail-grid { margin-top: 12px; }
  .movement-panel { grid-column: auto; }
}
</style>
