<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Chart from "../common/LineChart.vue";
import Skeleton from "primevue/skeleton";
import type { ChartData, ChartOptions } from "chart.js";
import { formatTwd } from "../../utils/formatters";

export interface TrendPoint { month: string; netTwd: number; assetTwd: number; liabilityTwd: number; }
const props = defineProps<{ trendRows: TrendPoint[]; selectedMonth: string; loading?: boolean }>();
const emit = defineEmits<{ "select-month": [month: string] }>();
type Metric = "netTwd" | "assetTwd" | "liabilityTwd" | "compare";
const metric = ref<Metric>("netTwd");
const range = ref<6 | 12 | 0>(12);
const rangeEnd = ref("");
const ranges = [{ label: "半年", value: 6 as const }, { label: "一年", value: 12 as const }, { label: "全部", value: 0 as const }];
const metrics: { label: string; value: Metric }[] = [{ label: "淨值", value: "netTwd" }, { label: "資產", value: "assetTwd" }, { label: "負債", value: "liabilityTwd" }, { label: "比較", value: "compare" }];
function monthNumber(month: string) { const [year = 0, value = 1] = month.split("-").map(Number); return year * 12 + value - 1; }
watch([() => props.selectedMonth, () => props.trendRows, range], () => {
  const latest = props.trendRows.at(-1)?.month ?? props.selectedMonth;
  if (!rangeEnd.value || range.value === 0) rangeEnd.value = latest;
  const selected = monthNumber(props.selectedMonth);
  const end = monthNumber(rangeEnd.value);
  if (selected > end || (range.value > 0 && selected < end - range.value + 1)) rangeEnd.value = props.selectedMonth;
}, { immediate: true });
const visibleRows = computed(() => range.value === 0 ? props.trendRows : props.trendRows.filter((row) => {
  const month = monthNumber(row.month);
  const end = monthNumber(rangeEnd.value);
  return month <= end && month >= end - range.value + 1;
}));

const colors = ref({ text: "#64748b", line: "#e2e8f0", surface: "#ffffff", main: "#1e293b", primary: "#10b981", asset: "#10b981", liability: "#f43f5e" });
let observer: MutationObserver | undefined;
function refreshTheme() {
  const css = getComputedStyle(document.documentElement);
  const read = (name: string) => css.getPropertyValue(name).trim();
   colors.value = { text: read("--text-sub"), line: read("--line-soft"), surface: read("--surface"), main: read("--text-main"), primary: read("--chart-net"), asset: read("--chart-asset"), liability: read("--chart-liability") };
}
onMounted(() => {
  refreshTheme();
  observer = new MutationObserver(refreshTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
});
onUnmounted(() => observer?.disconnect());
const chartData = computed<ChartData<"line">>(() => {
  const keys: Exclude<Metric, "compare">[] = metric.value === "compare" ? ["netTwd", "assetTwd", "liabilityTwd"] : [metric.value];
  const labels = { netTwd: "淨值", assetTwd: "資產", liabilityTwd: "負債" };
  const palette = { netTwd: colors.value.primary, assetTwd: colors.value.asset, liabilityTwd: colors.value.liability };
  return {
    labels: visibleRows.value.map((row) => row.month),
    datasets: keys.map((key) => ({
      label: labels[key], data: visibleRows.value.map((row) => row[key]),
      borderColor: palette[key], backgroundColor: palette[key],
      borderDash: key === "assetTwd" && metric.value === "compare" ? [5, 4] : key === "liabilityTwd" ? [2, 3] : [],
      borderWidth: 2, tension: 0.15, fill: false,
      pointRadius: visibleRows.value.map((row) => row.month === props.selectedMonth ? 4 : 2),
      pointHoverRadius: 5, pointHitRadius: 14,
    })),
  };
});
const chartOptions = computed<ChartOptions<"line">>(() => ({
  responsive: true, maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  onClick: (_event, elements) => {
    const point = elements[0];
    if (!point) return;
    const row = visibleRows.value[point.index];
    if (row) emit("select-month", row.month);
  },
  plugins: {
    legend: { display: metric.value === "compare", position: "bottom", labels: { color: colors.value.text, boxWidth: 16, boxHeight: 2 } },
    tooltip: {
       backgroundColor: colors.value.surface, titleColor: colors.value.main, bodyColor: colors.value.main,
      footerColor: colors.value.text, borderColor: colors.value.line, borderWidth: 1, cornerRadius: 6,
      callbacks: { label: (context) => `${context.dataset.label}：${formatTwd(context.parsed.y ?? 0)} TWD`, footer: () => "點選切換月份" },
    },
  },
  scales: {
    x: { grid: { display: false }, border: { color: colors.value.line }, ticks: { color: colors.value.text, maxTicksLimit: 8, maxRotation: 0 } },
    y: { grid: { color: colors.value.line }, border: { display: false }, ticks: { color: colors.value.text, maxTicksLimit: 5, callback: (value) => Math.abs(Number(value)) >= 10000 ? `${(Number(value) / 10000).toLocaleString("zh-TW", { maximumFractionDigits: 1 })}萬` : Number(value).toLocaleString("zh-TW") } },
  },
}));
</script>

<template>
  <section class="workspace-panel trend-panel" :aria-busy="loading">
    <div class="toolbar trend-heading">
      <div><h2 class="section-heading">資產水位</h2><p class="muted-label">折合台幣・{{ visibleRows[0]?.month ?? '尚無紀錄' }}<template v-if="visibleRows.length"> — {{ visibleRows.at(-1)?.month }}</template></p></div>
      <div class="segmented-control" aria-label="水位期間">
        <button v-for="option in ranges" :key="option.value" type="button" :class="{ active: range === option.value }" :aria-pressed="range === option.value" @click="range = option.value">{{ option.label }}</button>
      </div>
    </div>
    <div class="toolbar trend-controls">
      <div class="segmented-control" aria-label="水位指標">
        <button v-for="option in metrics" :key="option.value" type="button" :class="{ active: metric === option.value }" :aria-pressed="metric === option.value" @click="metric = option.value">{{ option.label }}</button>
      </div>
    </div>
    <div class="chart-container">
      <Skeleton v-if="loading" width="100%" height="100%" />
      <p v-else-if="!visibleRows.length" class="empty-state">新增每月紀錄後，即可查看資產水位。</p>
      <Chart v-else type="line" :data="chartData" :options="chartOptions" class="trend-chart" />
    </div>
    <div v-if="!loading && visibleRows.length" class="month-shortcuts" aria-label="選取水位月份">
      <button v-for="row in visibleRows" :key="row.month" type="button" :aria-pressed="row.month === selectedMonth" @click="emit('select-month', row.month)">{{ row.month }}</button>
    </div>
  </section>
</template>

<style scoped>
.trend-panel { min-width: 0; padding: 18px; background: var(--surface); border: 1px solid var(--line-soft); border-radius: 10px; box-shadow: none; }
.trend-heading, .trend-controls { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.trend-heading p { margin: 4px 0 0; font-size: 13px; }
.trend-controls { margin: 14px 0 10px; }
.trend-controls > span { font-size: 12px; }
.chart-container { height: 238px; position: relative; }
.trend-chart { position: absolute; inset: 0; height: 100%; width: 100%; }
.empty-state { padding-top: 80px; text-align: center; font-size: 13px; color: var(--text-sub); }
.month-shortcuts { display: flex; gap: 4px; overflow-x: auto; margin-top: 8px; }
.month-shortcuts button { border: 0; background: transparent; padding: 4px 7px; font-size: 12px; white-space: nowrap; color: var(--text-sub); cursor: pointer; border-radius: 4px; }
.month-shortcuts button[aria-pressed="true"] { background: var(--primary-soft); color: var(--primary); }
button:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
</style>
