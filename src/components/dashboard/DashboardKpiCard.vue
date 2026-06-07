<script setup lang="ts">
/**
 * DashboardKpiCard — 儀表板整合型 KPI 卡片
 *
 * 將本月淨值、總資產、總負債整合在同一個卡片中。
 * 在手機版上會自動調整為雙層結構，大螢幕上則為左右排版，版面更為緊湊。
 */
import Skeleton from "primevue/skeleton";

defineProps<{
  loading?: boolean;
  netWorth: string;
  totalAsset: string;
  totalLiability: string;
  delta?: string;
  deltaPct?: number | null;
  deltaValue?: number;
}>();
</script>

<template>
  <!-- 載入中狀態 -->
  <div v-if="loading" class="apollo-card flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <div class="flex flex-col gap-2">
      <Skeleton width="120px" height="13px" borderRadius="6px" />
      <Skeleton width="180px" height="36px" borderRadius="8px" />
      <Skeleton width="140px" height="13px" borderRadius="6px" />
    </div>
    <div class="grid grid-cols-2 gap-6 sm:gap-12 sm:shrink-0">
      <div class="flex flex-col gap-2">
        <Skeleton width="40px" height="13px" borderRadius="6px" />
        <Skeleton width="100px" height="22px" borderRadius="6px" />
      </div>
      <div class="flex flex-col gap-2">
        <Skeleton width="40px" height="13px" borderRadius="6px" />
        <Skeleton width="100px" height="22px" borderRadius="6px" />
      </div>
    </div>
  </div>

  <!-- 正常狀態 -->
  <div v-else class="apollo-card flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
    <!-- 本月淨值與增減（永遠佔滿整行，不截斷） -->
    <div class="flex flex-col gap-0.5">
      <span class="text-[12px] sm:text-[13px] font-bold text-[var(--text-sub)]">
        本月淨值 (TWD)
      </span>
      <span class="text-[32px] sm:text-3xl leading-tight font-extrabold text-[var(--text-main)] tabular-nums tracking-tight">
        {{ netWorth }}
      </span>
      
      <!-- 增減狀態 -->
      <div v-if="delta !== undefined || deltaPct !== undefined" class="flex items-center gap-1 mt-0.5">
        <span 
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
          :class="(deltaValue ?? 0) >= 0 ? 'bg-[var(--positive)]' : 'bg-[var(--negative)]'"
        />
        <span 
          class="text-[11px] sm:text-xs font-bold tabular-nums flex items-center gap-0.5 sm:gap-1"
          :class="(deltaValue ?? 0) >= 0 ? 'text-[var(--positive)]' : 'text-[var(--negative)]'"
        >
          比上月 {{ delta }}
          <span v-if="deltaPct !== null && deltaPct !== undefined" class="text-[10px] sm:text-[11px] opacity-90">
            ({{ (deltaValue ?? 0) >= 0 ? '+' : '' }}{{ deltaPct.toFixed(1) }}%)
          </span>
          <i
            :class="(deltaValue ?? 0) >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
            class="text-[9px] sm:text-[9px]"
          />
        </span>
      </div>
    </div>

    <!-- 總資產與總負債（手機靠左對齊，桌面靠右） -->
    <div class="grid grid-cols-2 gap-6 sm:gap-12 sm:shrink-0">
      <!-- 總資產 -->
      <div class="flex flex-col gap-0.5">
        <span class="text-[11px] sm:text-[11px] font-bold text-[var(--text-sub)]">總資產</span>
        <span class="text-[22px] sm:text-xl leading-tight font-extrabold text-[var(--positive)] tabular-nums">
          {{ totalAsset }}
        </span>
      </div>
      <!-- 總負債 -->
      <div class="flex flex-col gap-0.5">
        <span class="text-[11px] sm:text-[11px] font-bold text-[var(--text-sub)]">總負債</span>
        <span class="text-[22px] sm:text-xl leading-tight font-extrabold text-[var(--negative)] tabular-nums">
          {{ totalLiability }}
        </span>
      </div>
    </div>
  </div>
</template>
