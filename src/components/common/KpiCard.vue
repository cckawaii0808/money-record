<script setup lang="ts">
/**
 * KpiCard — 統一規格的 KPI 數字卡
 *
 * Props:
 *   label     - 標題文字
 *   value     - 主要數值（已格式化字串）
 *   icon      - PrimeIcon class（e.g. "pi pi-wallet"）
 *   variant   - "default" | "positive" | "negative" | "neutral"
 *   delta     - 增減數值（選填，已格式化字串）
 *   deltaPct  - 增減百分比（選填，數字）
 *   loading   - 是否顯示 Skeleton
 */
import Skeleton from "primevue/skeleton";
import { changeColor } from "../../utils/valueColors";

defineProps<{
  label: string;
  value: string;
  icon?: string;
  variant?: "default" | "positive" | "negative" | "neutral";
  delta?: string;
  deltaPct?: number | null;
  deltaValue?: number | null;
  loading?: boolean;
}>();
</script>

<template>
  <div
    class="apollo-card flex flex-col gap-2"
  >
    <!-- Skeleton 狀態 -->
    <template v-if="loading">
      <Skeleton width="60%" height="12px" borderRadius="6px" />
      <Skeleton width="40%" height="24px" borderRadius="8px" />
      <Skeleton width="30%" height="12px" borderRadius="6px" />
    </template>

    <!-- 正常狀態 -->
    <template v-else>
      <div class="flex justify-between items-start">
        <div class="flex flex-col gap-1.5">
          <span class="text-[13px] font-bold text-[var(--text-main)]">
            {{ label }}
          </span>
          <span
            class="text-2xl font-black tabular-nums tracking-tight"
            :class="{
              'text-[var(--text-main)]': variant !== 'neutral',
              'text-[var(--text-sub)]': variant === 'neutral',
            }"
          >
            {{ value }}
          </span>
        </div>
        <div
          v-if="icon"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 opacity-90"
          :class="{
            'bg-[var(--primary-soft)] text-[var(--primary)]':
              !variant || variant === 'default' || variant === 'neutral',
             'bg-[var(--primary-soft)] text-[var(--positive)]': variant === 'positive',
             'bg-[var(--app-bg)] text-[var(--negative)]': variant === 'negative',
          }"
        >
          <i :class="icon"></i>
        </div>
      </div>

      <div v-if="delta !== undefined || deltaPct !== undefined">
        <span
          v-if="delta && deltaPct !== null && deltaPct !== undefined"
          class="text-sm font-bold tabular-nums flex items-center gap-1"
          :class="changeColor(deltaValue ?? deltaPct)"
        >
          {{ delta }}
          <span class="text-xs">
            ({{ deltaPct > 0 ? "+" : "" }}{{ deltaPct.toFixed(1) }}%)
          </span>
          <i
            v-if="(deltaValue ?? deltaPct) !== 0"
            :class="(deltaValue ?? deltaPct) > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
            class="text-[10px]"
          />
        </span>
        <span
          v-else-if="delta"
          class="text-sm font-bold"
          :class="changeColor(deltaValue)"
        >
          {{ delta }}
        </span>
        <span v-else class="text-sm font-bold text-[var(--text-sub)]">-</span>
      </div>
    </template>
  </div>
</template>
