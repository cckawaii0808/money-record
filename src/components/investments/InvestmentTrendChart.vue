<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Chart from "primevue/chart";
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
      borderWidth: 3,
      tension: 0.35,
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
      tension: 0.35,
      fill: false,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: "美股資產（折 TWD）",
      data: normalizedRows.value.map((row) => row.usValueTwd),
      borderColor: "#8b5cf6",
      backgroundColor: "rgba(139, 92, 246, 0.08)",
      borderWidth: 2,
      tension: 0.35,
      fill: false,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index" as const, intersect: false },
  plugins: {
    legend: {
      display: true,
      labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8 },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      titleColor: "#1e293b",
      bodyColor: "#475569",
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      callbacks: {
        label: (ctx: any) => ` ${ctx.dataset.label}: ${formatTwd(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6, font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: {
        font: { size: 11 },
        callback: (v: number) => {
          if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
          if (Math.abs(v) >= 10000) return `${(v / 10000).toFixed(0)}萬`;
          return v;
        },
      },
    },
  },
};
</script>

<template>
  <section class="apollo-card mt-6">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-5">
      <div>
        <h2 class="text-lg font-black text-[var(--text-main)] m-0">股票資產變化</h2>
        <p class="text-sm font-semibold text-[var(--text-sub)] mt-1 mb-0">
          依每次進入投資頁或手動更新報價留下快照，台股與美股折台幣同圖比較。
        </p>
      </div>

      <div class="flex flex-col gap-2 lg:items-end">
        <div class="flex flex-wrap gap-1.5">
          <Button
            v-for="opt in rangeOptions"
            :key="opt.value"
            :label="opt.label"
            size="small"
            rounded
            :outlined="selectedPreset !== opt.value"
            :severity="selectedPreset === opt.value ? 'primary' : 'secondary'"
            @click="applyRange(opt.value)"
          />
          <Button
            label="自訂"
            size="small"
            rounded
            :outlined="selectedPreset !== 'custom'"
            :severity="selectedPreset === 'custom' ? 'primary' : 'secondary'"
            @click="applyRange('custom')"
          />
        </div>

        <div v-if="selectedPreset === 'custom'" class="flex flex-wrap items-center gap-2">
          <input v-model="customStartDate" type="date" class="h-9 rounded-lg border border-[var(--line-soft)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text-main)]" />
          <span class="text-xs font-bold text-[var(--text-sub)]">到</span>
          <input v-model="customEndDate" type="date" class="h-9 rounded-lg border border-[var(--line-soft)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text-main)]" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      <div class="rounded-2xl bg-[var(--app-bg)] border border-[var(--line-soft)] p-4">
        <div class="text-xs font-bold text-[var(--text-sub)]">最新總股票資產</div>
        <div class="text-xl font-black text-[var(--text-main)] mt-1">{{ latestRow ? formatTwd(latestRow.totalValueTwd) : '—' }}</div>
      </div>
      <div class="rounded-2xl bg-[var(--app-bg)] border border-[var(--line-soft)] p-4">
        <div class="text-xs font-bold text-[var(--text-sub)]">台股資產</div>
        <div class="text-xl font-black text-blue-500 mt-1">{{ latestRow ? formatTwd(latestRow.twValueTwd) : '—' }}</div>
      </div>
      <div class="rounded-2xl bg-[var(--app-bg)] border border-[var(--line-soft)] p-4">
        <div class="text-xs font-bold text-[var(--text-sub)]">美股資產（折 TWD）</div>
        <div class="text-xl font-black text-violet-500 mt-1">{{ latestRow ? formatTwd(latestRow.usValueTwd) : '—' }}</div>
      </div>
    </div>

    <div class="relative h-[320px] min-h-0">
      <Skeleton v-if="loading" width="100%" height="100%" borderRadius="16px" />
      <div v-else-if="normalizedRows.length === 0" class="h-full rounded-2xl border border-dashed border-[var(--line-soft)] flex items-center justify-center text-sm font-semibold text-[var(--text-sub)]">
        尚無股票資產快照，進入投資頁更新報價後會自動建立紀錄。
      </div>
      <Chart v-else type="line" :data="chartData" :options="chartOptions" class="absolute inset-0 w-full h-full" />
    </div>
  </section>
</template>
