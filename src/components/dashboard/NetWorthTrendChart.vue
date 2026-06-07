<script setup lang="ts">
/**
 * NetWorthTrendChart — 淨值趨勢折線圖
 *
 * 支援切換 6 個月 / 12 個月 / 全部區間。
 * 點擊數據點可觸發月份選取。
 *
 * Props:
 *   trendRows - 完整的趨勢資料（已由 Store 計算）
 *   loading   - 是否載入中
 *
 * Emits:
 *   select-month - 使用者點擊某數據點時觸發
 */
import { computed, ref } from "vue";
import Chart from "primevue/chart";
import Skeleton from "primevue/skeleton";
import { formatTwd } from "../../utils/formatters";

export interface TrendPoint {
  month: string;
  netTwd: number;
}

const props = defineProps<{
  trendRows: TrendPoint[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  "select-month": [month: string];
}>();

type RangeOption = 6 | 12 | 0; // 0 = all
const selectedRange = ref<RangeOption>(12);

const rangeOptions = [
  { label: "近半年", value: 6 as RangeOption },
  { label: "近一年", value: 12 as RangeOption },
  { label: "全部", value: 0 as RangeOption },
];

const visibleRows = computed(() => {
  const rows = props.trendRows;
  if (selectedRange.value === 0 || rows.length <= selectedRange.value) {
    return rows;
  }
  return rows.slice(-selectedRange.value);
});

const chartData = computed(() => ({
  labels: visibleRows.value.map((r) => r.month),
  datasets: [
    {
      label: "淨值",
      data: visibleRows.value.map((r) => r.netTwd),
      borderColor: "#0f766e",
      backgroundColor: "rgba(15,118,110,0.08)",
      tension: 0.4,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBackgroundColor: "#0f766e",
      borderWidth: 2.5,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      titleColor: "#1e293b",
      titleFont: { size: 14, weight: "bold" as const },
      bodyColor: "#475569",
      bodyFont: { size: 13 },
      borderColor: "rgba(0, 0, 0, 0.1)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 12,
      displayColors: true,
      callbacks: {
        label: (ctx: any) => ` 淨值: ${formatTwd(ctx.parsed.y)}`,
        footer: () => "點擊可切換至該月詳情",
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
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

function onSelect(event: any) {
  const { index } = event;
  const row = visibleRows.value[index];
  if (row) {
    emit("select-month", row.month);
  }
}
</script>

<template>
  <div class="apollo-card flex flex-col h-[260px]">
    <div class="flex items-center justify-between mb-6">
      <span class="text-[17px] font-bold text-[var(--text-main)]">
        淨值趨勢
      </span>
      <div class="flex gap-1 bg-[var(--app-bg)] rounded-lg p-0.5">
        <button
          v-for="opt in rangeOptions"
          :key="opt.value"
          class="text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
          :class="
            selectedRange === opt.value
              ? 'bg-white text-[var(--primary)] shadow-sm'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
          "
          @click="selectedRange = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 w-full min-h-0 relative">
      <Skeleton v-if="loading" width="100%" height="100%" borderRadius="12px" />
      <Chart
        v-else
        type="line"
        :data="chartData"
        :options="chartOptions"
        @select="onSelect"
        class="absolute inset-0 w-full h-full"
      />
    </div>
  </div>
</template>
