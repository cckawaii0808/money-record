<script setup lang="ts">
/**
 * AssetDonutChart — 資產配置佔比圓餅圖
 *
 * Props:
 *   items     - 資產配置列表（accountName, netImpactTwd, pct）
 *   month     - 當前月份（顯示用途）
 *   loading   - 是否載入中
 */
import { computed, ref } from "vue";
import Chart from "primevue/chart";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";
import { ALLOCATION_PALETTE } from "../../constants";
import { formatTwd } from "../../utils/formatters";

export interface DonutItem {
  id?: string;
  accountName: string;
  netImpactTwd: number;
  deltaTwd: number;
  pct: string;
  currency?: string;
}

const props = defineProps<{
  items: DonutItem[];
  month: string;
  loading?: boolean;
}>();

const hoveredIdx = ref<number | null>(null);

const chartData = computed(() => ({
  labels: props.items.map((r) => `${r.accountName} (${r.pct}%)`),
  datasets: [
    {
      data: props.items.map((r) => r.netImpactTwd),
      backgroundColor: props.items.map(
        (_, i) => ALLOCATION_PALETTE[i % ALLOCATION_PALETTE.length]
      ),
      hoverOffset: 10,
      borderWidth: 2,
      borderColor: "transparent",
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "62%",
  layout: { padding: 15 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  onHover: (_event: any, elements: any) => {
    if (elements && elements.length > 0) {
      hoveredIdx.value = elements[0].index;
    } else {
      hoveredIdx.value = null;
    }
  },
}));

function getColor(index: number): string {
  return ALLOCATION_PALETTE[index % ALLOCATION_PALETTE.length];
}
</script>

<template>
  <div class="apollo-card flex flex-col h-full min-h-[400px]">
    <div class="flex items-center justify-between mb-6">
      <span class="text-[17px] font-bold text-[var(--text-main)]">
        資產配置
      </span>
      <Tag
        :value="month"
        severity="secondary"
        class="shadow-none bg-[var(--app-bg)] text-[var(--text-sub)] font-bold text-[10px]"
      />
    </div>

    <div class="flex-1 flex flex-col justify-center relative min-h-0">
      <Skeleton v-if="loading" width="100%" height="200px" borderRadius="12px" />

      <div
        v-else-if="!items.length"
        class="text-center text-[var(--text-sub)] text-sm py-12"
      >
        暫無資料
      </div>

      <template v-else>
        <!-- 圓餅圖 -->
        <div
          class="relative w-full max-h-[220px] mx-auto mb-6 shrink-0 aspect-square flex items-center justify-center"
        >
          <Chart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            class="w-full h-full"
          />
          <!-- 中央文字 -->
          <div
            class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center"
          >
            <template v-if="hoveredIdx !== null">
              <span
                class="text-[14px] uppercase tracking-widest text-[var(--text-sub)] font-bold mb-1 truncate max-w-[120px]"
              >
                {{ items[hoveredIdx]?.accountName }}
              </span>
              <span
                class="text-[18px] font-black text-[var(--primary)] tabular-nums leading-none"
              >
                {{ items[hoveredIdx]?.pct }}%
              </span>
            </template>
            <template v-else>
              <span
                class="text-[14px] uppercase tracking-widest text-[var(--text-sub)] font-bold mb-1"
              >
                總資產
              </span>
              <span
                class="text-[18px] font-black text-[var(--text-main)] tabular-nums leading-none mb-1"
              >
                100%
              </span>
            </template>
          </div>
        </div>

        <!-- 互動圖例列表 -->
        <div
          class="flex-1 overflow-y-auto w-full px-2"
          style="scrollbar-width: none"
        >
          <div class="flex flex-col">
            <div
              v-for="(item, idx) in items"
              :key="item.id || idx"
              class="flex items-center justify-between py-2.5 border-b border-[var(--line-soft)] last:border-none cursor-default hover:bg-[var(--app-bg)] px-2 transition-colors"
              @mouseenter="hoveredIdx = idx"
              @mouseleave="hoveredIdx = null"
            >
              <!-- 左側：燈號、帳戶名、佔比 -->
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-2.5 h-2.5 rounded-full shadow-sm shrink-0"
                  :style="{ background: getColor(idx) }"
                />
                <div class="flex flex-col">
                  <span class="text-[14px] font-bold text-[var(--text-main)] truncate max-w-[140px]">
                    {{ item.accountName }}
                  </span>
                  <span class="text-[11px] font-bold text-[var(--text-sub)] tabular-nums mt-0.5">
                    {{ item.pct }}%
                  </span>
                </div>
              </div>

              <!-- 右側：餘額與異動 -->
              <div class="flex flex-col items-end whitespace-nowrap">
                <span class="text-[14px] font-black tabular-nums text-[var(--text-main)] leading-tight">
                  {{ formatTwd(item.netImpactTwd) }}
                </span>
                <span
                  class="text-[12px] font-bold tabular-nums mt-0.5"
                  :class="item.deltaTwd >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'"
                >
                  {{ item.deltaTwd > 0 ? '+' : '' }}{{ formatTwd(item.deltaTwd) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
