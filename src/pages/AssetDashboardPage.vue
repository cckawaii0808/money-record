<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { NButton, NCard, NDatePicker, NGrid, NGi, NTag, useMessage } from "naive-ui";
import { ALLOCATION_PALETTE, DATE_PICKER_YEAR_RANGE } from "../constants";
import { formatInteger } from "../utils/formatters";
import AssetAllocationDonutChart from "../features/asset-manager/components/AssetAllocationDonutChart.vue";
import CombinedWaterLineChart from "../features/asset-manager/components/CombinedWaterLineChart.vue";
import { useAssetManager, type CombinedWaterPoint } from "../features/asset-manager/composables/useAssetManager";

const message = useMessage();

const {
  accounts,
  accountSnapshotRows,
  trendRows,
  combinedWaterPoints,
  formatPct,
  monthRangeValue,
  isMonthOutOfRange,
  rangeEndMonth,
  selectedMonth,
  maxMonth,
  selectAllAccounts,
  selectLatestMonth
} = useAssetManager();

type RangePreset = "three-month" | "six-month" | "this-year" | "custom";
const rangePreset = ref<RangePreset>("six-month");

const latestTrend = computed(() => trendRows.value[trendRows.value.length - 1] ?? null);
const netDelta = computed(() => Math.round(latestTrend.value?.delta ?? 0));
const netDeltaPct = computed(() => latestTrend.value?.pct ?? null);
const latestNet = computed(() => Math.round(latestTrend.value?.netTwd ?? 0));
const latestAsset = computed(() => Math.round(latestTrend.value?.assetTwd ?? 0));
const latestLiability = computed(() => Math.round(latestTrend.value?.liabilityTwd ?? 0));
const recentWaterPoints = computed(() => combinedWaterPoints.value.slice(-6));

const dashboardTrendPoints = computed<CombinedWaterPoint[]>(() => {
  const base = recentWaterPoints.value;
  if (base.length <= 1) {
    return base;
  }

  const output: CombinedWaterPoint[] = [];
  const pushPoint = (point: CombinedWaterPoint): void => {
    if (!output.some((item) => item.key === point.key)) {
      output.push(point);
    }
  };

  for (let i = 0; i < base.length - 1; i += 1) {
    const start = base[i];
    const end = base[i + 1];
    pushPoint(start);

    const [startYear, startMonth] = start.month.split("-").map(Number);
    const [endYear, endMonth] = end.month.split("-").map(Number);
    if (!startYear || !startMonth || !endYear || !endMonth) {
      continue;
    }

    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1);
    const totalMs = endDate.getTime() - startDate.getTime();
    if (totalMs <= 0) {
      continue;
    }

    for (let dayOffset = 7; dayOffset < 31; dayOffset += 7) {
      const current = new Date(startDate);
      current.setDate(current.getDate() + dayOffset);
      if (current >= endDate) {
        break;
      }
      const ratio = (current.getTime() - startDate.getTime()) / totalMs;
      const value = start.totalTwd + (end.totalTwd - start.totalTwd) * ratio;
      const month = `${current.getMonth() + 1}/${`${current.getDate()}`.padStart(2, "0")}`;
      pushPoint({
        key: `${start.key}-w${dayOffset}`,
        month,
        totalTwd: value
      });
    }
  }

  pushPoint(base[base.length - 1]);
  return output;
});

const accountCount = computed(() => accounts.value.length);
const rangeLabelMap: Record<RangePreset, string> = {
  "three-month": "3個月",
  "six-month": "6個月",
  "this-year": "今年",
  custom: "區間"
};
const rangePresetOptions: RangePreset[] = ["three-month", "six-month", "this-year"];
const rangeMinTimestamp = new Date(2020, 0, 1).getTime();
const rangeMaxTimestamp = computed(() => {
  const [year, month] = maxMonth.value.split("-").map(Number);
  if (year && month) {
    return new Date(year, month - 1, 28).getTime();
  }
  return Date.now();
});
const draftRangeValue = ref<[number, number] | null>(null);

function formatDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}/${month}/${day}`;
}

const trendTitle = computed(() => {
  if (rangePreset.value === "three-month") {
    return "最近 3 個月淨值走勢";
  }
  if (rangePreset.value === "six-month") {
    return "最近 6 個月淨值走勢";
  }
  if (rangePreset.value === "this-year") {
    return "今年淨值走勢";
  }
  const activeRange = monthRangeValue.value ?? draftRangeValue.value;
  if (!activeRange) {
    return "指定區間淨值走勢";
  }
  return `指定區間淨值走勢（${formatDateLabel(activeRange[0])} - ${formatDateLabel(activeRange[1])}）`;
});

function clampDateRange(value: [number, number]): {
  range: [number, number];
  changed: boolean;
} {
  const [rawStart, rawEnd] = value;
  const min = rangeMinTimestamp;
  const max = rangeMaxTimestamp.value;
  const start = Math.min(Math.max(rawStart, min), max);
  const end = Math.min(Math.max(rawEnd, min), max);
  const range: [number, number] = start <= end ? [start, end] : [end, start];
  const changed = range[0] !== rawStart || range[1] !== rawEnd;
  return { range, changed };
}

const dashboardRangeValue = computed<[number, number] | null>({
  get() {
    return draftRangeValue.value;
  },
  set(value) {
    if (!value) {
      return;
    }
    const { range, changed } = clampDateRange(value);
    draftRangeValue.value = range;
    if (changed) {
      message.warning("可選範圍為 2020/01/01 到今天", { duration: 1000 });
    }
  }
});

function applyConfirmedRange(value: [number, number] | null): void {
  if (!value) {
    return;
  }
  const { range, changed } = clampDateRange(value);
  draftRangeValue.value = range;
  monthRangeValue.value = range;
  rangePreset.value = "custom";
  selectedMonth.value = rangeEndMonth.value;
  if (changed) {
    message.warning("可選範圍為 2020/01/01 到今天", { duration: 1000 });
  }
}

function handleRangeConfirm(value: number | [number, number] | null): void {
  if (!Array.isArray(value)) {
    return;
  }
  applyConfirmedRange([value[0], value[1]]);
}

const latestNetLabel = computed(() => formatInteger(latestNet.value));
const latestAssetLabel = computed(() => formatInteger(latestAsset.value));
const latestLiabilityLabel = computed(() => formatInteger(latestLiability.value));
const netDeltaLabel = computed(() => {
  const sign = netDelta.value > 0 ? "+" : "";
  return `${sign}${formatInteger(netDelta.value)}`;
});
const deltaToneClass = computed(() => {
  if (netDelta.value > 0) {
    return "tone-up";
  }
  if (netDelta.value < 0) {
    return "tone-down";
  }
  return "tone-flat";
});

const allocationRows = computed(() => {
  const assets = accountSnapshotRows.value
    .filter((row) => row.type === "asset" && row.netImpactTwd > 0)
    .sort((a, b) => b.netImpactTwd - a.netImpactTwd);
  const total = assets.reduce((sum, row) => sum + row.netImpactTwd, 0);

  if (total <= 0) {
    return [];
  }

  return assets.map((row, index) => ({
    key: row.key,
    label: row.accountName,
    valueTwd: row.netImpactTwd,
    share: (row.netImpactTwd / total) * 100,
    color: ALLOCATION_PALETTE[index % ALLOCATION_PALETTE.length]
  }));
});

function applyRangePreset(preset: RangePreset): void {
  if (preset === "custom") {
    if (!draftRangeValue.value) {
      message.warning("請先選擇日期區間", { duration: 1000 });
      return;
    }
    monthRangeValue.value = draftRangeValue.value;
    rangePreset.value = "custom";
    selectedMonth.value = rangeEndMonth.value;
    return;
  }

  rangePreset.value = preset;
  const [maxYear, maxMon] = maxMonth.value.split("-").map(Number);
  const endDate = (maxYear && maxMon) ? new Date(maxYear, maxMon - 1, 28) : new Date();
  let start = new Date(endDate);

  if (preset === "three-month") {
    start = new Date(endDate.getFullYear(), endDate.getMonth() - 2, 1);
  } else if (preset === "six-month") {
    start = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
  } else if (preset === "this-year") {
    start = new Date(endDate.getFullYear(), 0, 1);
  }
  const { range } = clampDateRange([start.getTime(), endDate.getTime()]);
  draftRangeValue.value = range;
  monthRangeValue.value = range;
  selectedMonth.value = rangeEndMonth.value;
}

watch(
  monthRangeValue,
  (value) => {
    if (value) {
      draftRangeValue.value = [...value] as [number, number];
    }
  },
  { immediate: true }
);

onMounted(() => {
  selectAllAccounts();
  selectLatestMonth();
  applyRangePreset("six-month");
});
</script>

<template>
  <div class="page-container">
    <NGrid :x-gap="10" :y-gap="10" cols="2 s:2 m:4 l:4" responsive="screen">
      <NGi>
        <NCard class="kpi-card kpi-net" :bordered="false">
          <div class="kpi-label">總淨值（TWD）</div>
          <div class="kpi-value">{{ latestNetLabel }}</div>
        </NCard>
      </NGi>
      <NGi>
        <NCard class="kpi-card" :bordered="false">
          <div class="kpi-label">本月變化</div>
          <div class="kpi-value" :class="deltaToneClass">{{ netDeltaLabel }}</div>
          <div class="kpi-foot" :class="deltaToneClass">{{ formatPct(netDeltaPct) }}</div>
        </NCard>
      </NGi>
      <NGi>
        <NCard class="kpi-card" :bordered="false">
          <div class="kpi-label">總資產（TWD）</div>
          <div class="kpi-value">{{ latestAssetLabel }}</div>
        </NCard>
      </NGi>
      <NGi>
        <NCard class="kpi-card" :bordered="false">
          <div class="kpi-label">總負債（TWD）</div>
          <div class="kpi-value">{{ latestLiabilityLabel }}</div>
        </NCard>
      </NGi>
    </NGrid>

    <NGrid class="charts-grid" :x-gap="16" :y-gap="16" cols="1 s:1 m:2 l:2" responsive="screen">
      <NGi>
        <NCard class="panel-card chart-panel" :bordered="false">
          <template #header>
            <div class="panel-title">{{ trendTitle }}</div>
          </template>
          <div class="trend-toolbar">
            <div class="range-actions">
              <NButton
                v-for="preset in rangePresetOptions"
                :key="preset"
                size="small"
                :type="rangePreset === preset ? 'primary' : 'default'"
                :secondary="rangePreset !== preset"
                class="range-tab"
                @click="applyRangePreset(preset)"
              >
                {{ rangeLabelMap[preset] }}
              </NButton>
            </div>
            <NDatePicker
              v-model:value="dashboardRangeValue"
              type="daterange"
              format="yyyy/MM/dd"
              :clearable="false"
              :is-date-disabled="isMonthOutOfRange"
              :year-range="DATE_PICKER_YEAR_RANGE"
              :default-calendar-start-time="rangeMinTimestamp"
              :default-calendar-end-time="rangeMaxTimestamp"
              class="range-picker"
              @confirm="handleRangeConfirm"
            />
          </div>
          <div class="trend-chart-wrap">
            <CombinedWaterLineChart
              :points="dashboardTrendPoints"
              :chart-height="560"
              :show-point-values="false"
              preset="dashboard"
            />
          </div>
        </NCard>
      </NGi>
      <NGi>
        <NCard class="panel-card chart-panel" :bordered="false">
          <template #header>
            <div class="panel-title">資產佔比</div>
          </template>
          <AssetAllocationDonutChart :rows="allocationRows" />
        </NCard>
      </NGi>
    </NGrid>
  </div>
</template>

<style scoped>
.kpi-card {
  height: 100%;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--surface) 95%, transparent) 0%,
    color-mix(in srgb, var(--surface) 92%, var(--primary) 8%) 100%
  );
}

.kpi-net {
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--positive) 16%, transparent) 0%,
      color-mix(in srgb, var(--positive) 0%, transparent) 100%
    ),
    var(--surface);
}

.kpi-label {
  color: var(--text-sub);
  font-weight: 700;
  font-size: 13px;
}

.kpi-value {
  margin-top: 6px;
  color: var(--text-main);
  font-size: clamp(30px, 2.7vw, 38px);
  font-weight: 800;
  line-height: 1.1;
}

.kpi-foot {
  margin-top: 8px;
  color: var(--text-sub);
  font-size: 13px;
}

.tone-up {
  color: var(--positive);
}

.tone-down {
  color: var(--negative);
}

.tone-flat {
  color: var(--text-sub);
}

.trend-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(300px, 42%, 520px);
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.range-actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.range-tab {
  border-radius: 999px;
  min-width: 64px;
  padding-inline: 14px;
}

.range-picker {
  width: 100%;
  min-width: 0;
  justify-self: end;
}

.trend-chart-wrap {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.panel-card {
  background: var(--surface);
}

.charts-grid {
  align-items: stretch;
}

.chart-panel {
  height: 100%;
}

.chart-panel :deep(.n-card__content) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-main);
}

@media (max-width: 900px) {
  .trend-toolbar {
    display: flex;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
  }

  .range-picker {
    min-width: 0;
    width: 100%;
  }

  .chart-panel {
    min-height: auto;
  }
}
</style>
