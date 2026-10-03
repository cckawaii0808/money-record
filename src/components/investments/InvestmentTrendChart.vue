<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import Chart from "../common/LineChart.vue";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import type { InvestmentSnapshotPoint } from "../../types";
import { formatTwd } from "../../utils/formatters";

type RangePreset = "7d" | "30d" | "90d" | "ytd" | "all" | "custom";

const props = defineProps<{
  snapshots: InvestmentSnapshotPoint[];
  usdToTwd: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "range-change": [payload: { startDate?: string; endDate?: string }];
}>();

const selectedPreset = ref<RangePreset>("30d");
const customStartDate = ref("");
const customEndDate = ref("");
const themeColors = ref({ text: "#64748b", surface: "#ffffff", border: "#e2e8f0", main: "#1e293b" });
let themeObserver: MutationObserver | undefined;

function updateThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  themeColors.value = {
    text: styles.getPropertyValue("--text-sub").trim(),
    surface: styles.getPropertyValue("--surface").trim(),
    border: styles.getPropertyValue("--line-soft").trim(),
    main: styles.getPropertyValue("--text-main").trim(),
  };
}

onMounted(() => {
  updateThemeColors();
  themeObserver = new MutationObserver(updateThemeColors);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
});
onUnmounted(() => themeObserver?.disconnect());

const rangeOptions: Array<{ label: string; value: RangePreset }> = [
  { label: "近 7 天", value: "7d" },
  { label: "近 30 天", value: "30d" },
  { label: "近 90 天", value: "90d" },
  { label: "今年", value: "ytd" },
  { label: "全部", value: "all" },
];

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function presetToRange(preset: RangePreset): { startDate?: string; endDate?: string } {
  if (preset === "all") return {};
  if (preset === "custom") {
    return {
      startDate: customStartDate.value || undefined,
      endDate: customEndDate.value || undefined,
    };
  }

  const today = new Date();
  const start = new Date(today);
  if (preset === "ytd") {
    start.setMonth(0, 1);
  } else {
    const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
    start.setDate(today.getDate() - days + 1);
  }

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(today),
  };
}

function applyRange(preset: RangePreset = selectedPreset.value) {
  selectedPreset.value = preset;
  emit("range-change", presetToRange(preset));
}

watch([customStartDate, customEndDate], () => {
  if (selectedPreset.value === "custom") {
    applyRange("custom");
  }
});

const normalizedRows = computed(() =>
  props.snapshots.map((item) => {
    const usValueTwd = item.usValue * props.usdToTwd;
    return {
      ...item,
      label: item.capturedAt || item.date,
      twValueTwd: item.twValue,
      usValueTwd,
      totalValueTwd: item.twValue + usValueTwd,
    };
  }),
);

const latestRow = computed(() => normalizedRows.value.at(-1));

const chartData = computed(() => ({
  labels: normalizedRows.value.map((row) => row.label),
  datasets: [
    {
      label: "總股票資產",
      data: normalizedRows.value.map((row) => row.totalValueTwd),
      borderColor: "#0f766e",
      backgroundColor: "rgba(15, 118, 110, 0.08)",
      borderWidth: 2,
      tension: 0.2,
      fill: false,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: "台股資產",
      data: normalizedRows.value.map((row) => row.twValueTwd),
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.08)",
      borderWidth: 2,
      tension: 0.2,
      fill: false,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: "美股資產（折 TWD）",
      data: normalizedRows.value.map((row) => row.usValueTwd),
      borderColor: "#64748b",
      backgroundColor: "rgba(100, 116, 139, 0.08)",
      borderWidth: 2,
      tension: 0.2,
      fill: false,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  plugins: {
    legend: {
      display: true,
      position: "bottom" as const,
      labels: { color: themeColors.value.text, usePointStyle: true, boxWidth: 6, boxHeight: 6, padding: 16, font: { size: 11 } },
    },
    tooltip: {
      backgroundColor: themeColors.value.surface,
      titleColor: themeColors.value.main,
      bodyColor: themeColors.value.text,
      borderColor: themeColors.value.border,
      borderWidth: 1,
      padding: 10,
      cornerRadius: 6,
      callbacks: {
        label: (ctx: any) => ` ${ctx.dataset.label}: ${formatTwd(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: themeColors.value.text, maxRotation: 0, autoSkip: true, maxTicksLimit: 6, font: { size: 11 } },
    },
    y: {
      border: { display: false },
      grid: { color: themeColors.value.border },
      ticks: {
        color: themeColors.value.text,
        font: { size: 11 },
        callback: (value: string | number) => {
          const v = Number(value);
          if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
          if (Math.abs(v) >= 10000) return `${(v / 10000).toFixed(0)}萬`;
          return v;
        },
      },
    },
  },
}));
</script>

<template>
  <section class="workspace-panel trend-panel" aria-labelledby="investment-trend-heading" :aria-busy="loading">
    <div class="trend-heading">
      <div>
        <h2 id="investment-trend-heading" class="section-heading">股票資產變化</h2>
      </div>

      <div class="flex flex-col gap-2 lg:items-end">
        <div class="trend-ranges" role="group" aria-label="股票資產快照日期區間">
          <Button
            v-for="opt in rangeOptions"
            :key="opt.value"
            :label="opt.label"
            size="small"
            :aria-pressed="selectedPreset === opt.value"
            :aria-label="`查看${opt.label}股票資產快照`"
            :outlined="selectedPreset !== opt.value"
            :severity="selectedPreset === opt.value ? 'primary' : 'secondary'"
            @click="applyRange(opt.value)"
          />
          <Button
            label="自訂"
            size="small"
            :aria-pressed="selectedPreset === 'custom'"
            aria-label="自訂股票資產快照日期區間"
            :outlined="selectedPreset !== 'custom'"
            :severity="selectedPreset === 'custom' ? 'primary' : 'secondary'"
            @click="applyRange('custom')"
          />
        </div>

        <div v-if="selectedPreset === 'custom'" class="flex flex-wrap items-center gap-2">
          <label class="sr-only" for="investment-trend-start">快照開始日期</label>
          <input id="investment-trend-start" v-model="customStartDate" type="date" :max="customEndDate || undefined" class="trend-date" />
          <span class="text-xs font-bold text-[var(--text-sub)]">到</span>
          <label class="sr-only" for="investment-trend-end">快照結束日期</label>
          <input id="investment-trend-end" v-model="customEndDate" type="date" :min="customStartDate || undefined" class="trend-date" />
        </div>
      </div>
    </div>

    <div class="trend-metrics">
      <div>
        <div class="muted-label">區間最新總市值 <span class="currency-badge">TWD</span></div>
        <div class="trend-metric-value">{{ latestRow ? formatTwd(latestRow.totalValueTwd) : '—' }}</div>
      </div>
      <div>
        <div class="muted-label">台股市值（TWD）</div>
        <div class="trend-metric-value">{{ latestRow ? formatTwd(latestRow.twValueTwd) : '—' }}</div>
      </div>
      <div>
        <div class="muted-label">美股市值（折 TWD）</div>
        <div class="trend-metric-value">{{ latestRow ? formatTwd(latestRow.usValueTwd) : '—' }}</div>
        <div v-if="latestRow" class="muted-label">原幣 USD {{ latestRow.usValue.toLocaleString('en-US', { maximumFractionDigits: 2 }) }}</div>
      </div>
    </div>
    <p v-if="latestRow" class="trend-note muted-label">{{ latestRow.label }} · TWD</p>

    <div class="trend-chart">
      <Skeleton v-if="loading" width="100%" height="100%" borderRadius="6px" aria-label="正在載入股票資產快照" />
      <div v-else-if="normalizedRows.length === 0" class="trend-empty" role="status">
        此區間尚無股票資產快照，可更新報價建立紀錄或切換日期區間。
      </div>
      <Chart v-else type="line" :data="chartData" :options="chartOptions" :canvasProps="{ role: 'img', 'aria-label': `股票資產變化折台幣圖，包含 ${normalizedRows.length} 筆快照，比較總市值、台股與美股市值` }" class="absolute inset-0 w-full h-full" />
    </div>
  </section>
</template>

<style scoped>
.trend-panel { margin-top: 16px; padding: 20px; }
.trend-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 18px; }
.trend-heading h2 { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: var(--text-main); }
.trend-heading p { margin: 0; font-size: 12px; line-height: 1.7; }
.trend-ranges { display: flex; flex-wrap: wrap; gap: 4px; }
.trend-ranges :deep(.p-button) { border-radius: 5px; padding: 5px 9px; font-size: 11px; box-shadow: none; }
.trend-date { height: 34px; max-width: 100%; padding: 0 8px; border: 1px solid var(--line-soft); border-radius: 5px; background: var(--surface); color: var(--text-main); font: inherit; font-size: 12px; color-scheme: light dark; }
.trend-date:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.trend-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; padding-block: 14px; border-block: 1px solid var(--line-soft); }
.trend-metrics .muted-label { font-size: 11px; line-height: 1.7; }
.trend-metric-value { margin: 5px 0 2px; color: var(--text-main); font-size: 21px; font-weight: 600; font-variant-numeric: tabular-nums; }
.trend-note { font-size: 11px; line-height: 1.7; margin: 12px 0 16px; }
.trend-chart { position: relative; height: 280px; min-height: 0; }
.trend-empty { height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; border: 1px dashed var(--line-soft); border-radius: 6px; color: var(--text-sub); font-size: 13px; text-align: center; line-height: 1.7; }
@media (max-width: 900px) { .trend-heading { flex-direction: column; } }
@media (max-width: 640px) {
  .trend-panel { padding: 16px; }
  .trend-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .trend-metrics > div:first-child { grid-column: 1 / -1; }
  .trend-metric-value { font-size: 18px; }
  .trend-chart { height: 240px; }
}
</style>
