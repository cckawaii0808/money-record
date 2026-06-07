<script setup lang="ts">
/**
 * DashboardPage — 資產總覽儀表板
 *
 * 新版面配置（由使用者關注度排序）：
 *   1. KPI 摘要（淨值 / 增減 / 總資產）
 *   2. 資產配置佔比（圓餅圖）+ 本月異動 Top5
 *   3. 淨值趨勢（可切 6/12/全部）
 *   4. 本月綜合明細表格
 */
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useIsDesktop } from "../composables/useIsDesktop";
import { useAssetManagerStore } from "../stores";
import { formatTwd } from "../utils/formatters";

// ── 共用元件 ──
import PageHeader from "../components/common/PageHeader.vue";
import MonthNavigator from "../components/common/MonthNavigator.vue";

// ── Dashboard 專用元件 ──
import DashboardKpiCard from "../components/dashboard/DashboardKpiCard.vue";
import AssetDonutChart from "../components/dashboard/AssetDonutChart.vue";
import type { DonutItem } from "../components/dashboard/AssetDonutChart.vue";
import NetWorthTrendChart from "../components/dashboard/NetWorthTrendChart.vue";
import TopChangesCard from "../components/dashboard/TopChangesCard.vue";
import type { ChangeItem } from "../components/dashboard/TopChangesCard.vue";

const { isDesktop } = useIsDesktop();
const assetManager = useAssetManagerStore();

const {
  isLoading,
  trendRows,
  accountSnapshotRows,
  selectedMonth,
  months,
  selectedNetTwd,
} = storeToRefs(assetManager);

const { selectLatestMonth, formatCurrency } = assetManager;

selectLatestMonth();

// ── KPI 數據 ──
const selectedTrend = computed(
  () => trendRows.value.find((r) => r.month === selectedMonth.value) ?? null
);

const kpiNetWorth = computed(() => formatTwd(Math.round(selectedTrend.value?.netTwd ?? 0)));
const kpiDelta = computed(() => {
  const d = Math.round(selectedTrend.value?.delta ?? 0);
  return d >= 0 ? `+${formatTwd(d)}` : formatTwd(d);
});
const kpiTotalAsset = computed(() => formatTwd(Math.round(selectedTrend.value?.assetTwd ?? 0)));
const kpiDeltaPct = computed(() => selectedTrend.value?.pct ?? null);
const kpiDeltaValue = computed(() => Math.round(selectedTrend.value?.delta ?? 0));

// ── 資產配置（給圓餅圖） ──
const assetAllocationList = computed<DonutItem[]>(() => {
  const assets = accountSnapshotRows.value
    .filter((r) => r.type === "asset" && r.netImpactTwd > 0)
    .sort((a, b) => b.netImpactTwd - a.netImpactTwd);
  const total = assets.reduce((sum, r) => sum + r.netImpactTwd, 0);

  const result: DonutItem[] = [];
  let otherTwd = 0;
  let otherDelta = 0;

  assets.forEach((r) => {
    const pctValue = total > 0 ? (r.netImpactTwd / total) * 100 : 0;
    if (pctValue < 1.0) {
      otherTwd += r.netImpactTwd;
      otherDelta += r.deltaTwd;
    } else {
      result.push({
        id: r.key,
        accountName: r.accountName,
        netImpactTwd: r.netImpactTwd,
        deltaTwd: r.deltaTwd,
        pct: pctValue.toFixed(1),
      });
    }
  });

  if (otherTwd > 0) {
    result.push({
      id: "other-small-assets",
      accountName: "其他小額資產",
      netImpactTwd: otherTwd,
      deltaTwd: otherDelta,
      pct: total > 0 ? ((otherTwd / total) * 100).toFixed(1) : "0.0",
    });
  }

  return result;
});

// ── 本月異動 Top5 ──
const topChangesRows = computed<ChangeItem[]>(() => {
  return accountSnapshotRows.value
    .filter((r) => r.delta !== 0)
    .map((r) => ({
      accountName: r.accountName,
      delta: r.delta,
      currency: r.currency,
      type: r.type,
    }));
});

// ── 事件處理 ──
function onTrendSelectMonth(month: string) {
  selectedMonth.value = month;
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 pt-4 sm:pt-6 pb-24 transition-all relative">
    <!-- 頁面標題 + 月份導航 -->
    <PageHeader title="資產總覽" :isDesktop="isDesktop">
      <MonthNavigator
        :modelValue="selectedMonth"
        :months="months"
        @update:modelValue="selectedMonth = $event"
      />
    </PageHeader>

    <!-- 主要儀表板佈局 (左 2/3 趨勢, 右 1/3 細節) -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 items-start">
      
      <!-- 左側區塊：KPI 與 淨值趨勢 -->
      <div class="xl:col-span-2 flex flex-col gap-6">
        <!-- KPI 摘要區塊 -->
        <DashboardKpiCard
          :loading="isLoading"
          :netWorth="kpiNetWorth"
          :totalAsset="kpiTotalAsset"
          :totalLiability="formatTwd(Math.round(selectedTrend?.liabilityTwd ?? 0))"
          :delta="kpiDelta"
          :deltaPct="kpiDeltaPct"
          :deltaValue="kpiDeltaValue"
        />

        <!-- 淨值趨勢 -->
        <NetWorthTrendChart
          :trendRows="trendRows"
          :loading="isLoading"
          @select-month="onTrendSelectMonth"
        />
      </div>

      <!-- 右側區塊：圓餅圖 -->
      <div class="xl:col-span-1 flex flex-col gap-6">
        <!-- 資產配置佔比 -->
        <AssetDonutChart
          :items="assetAllocationList"
          :month="selectedMonth"
          :loading="isLoading"
        />
      </div>

    </div>
  </div>
</template>
