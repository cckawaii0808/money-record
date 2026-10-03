<script setup lang="ts">
import Skeleton from "primevue/skeleton";
import { amountColor, changeColor } from "../../utils/valueColors";

defineProps<{
  loading?: boolean;
  netWorth: string;
  totalAsset: string;
  totalLiability: string;
  netWorthValue?: number;
  totalAssetValue?: number;
  totalLiabilityValue?: number;
  delta?: string;
  deltaPct?: number | null;
  deltaValue?: number;
  comparisonMonth?: string | null;
}>();
</script>

<template>
  <section class="workspace-panel summary" aria-label="所選月份資產摘要" :aria-busy="loading">
    <template v-if="loading">
      <div v-for="index in 4" :key="index" class="summary-item">
        <Skeleton width="5rem" height="0.75rem" />
        <Skeleton width="85%" height="1.75rem" />
      </div>
    </template>
    <template v-else>
      <div class="summary-item">
        <span class="muted-label">淨資產 · TWD</span>
        <strong class="summary-value" :class="netWorthValue === undefined ? 'text-main' : amountColor(netWorthValue)">{{ netWorth }}</strong>
      </div>
      <div class="summary-item">
        <span class="muted-label">總資產 · TWD</span>
        <strong class="summary-value" :class="totalAssetValue === undefined ? 'text-main' : amountColor(totalAssetValue)">{{ totalAsset }}</strong>
      </div>
      <div class="summary-item">
        <span class="muted-label">總負債 · TWD</span>
        <strong class="summary-value" :class="totalLiabilityValue === undefined ? 'text-main' : amountColor(totalLiabilityValue)">{{ totalLiability }}</strong>
      </div>
      <div class="summary-item">
        <span class="muted-label">淨資產月變動</span>
        <strong v-if="comparisonMonth" class="summary-value" :class="changeColor(deltaValue)">{{ delta }}</strong>
        <strong v-else class="summary-value summary-value--empty">無比較資料</strong>
      </div>
    </template>
  </section>
</template>

<style scoped>
.summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 0; border: 1px solid var(--line-soft); border-radius: 10px; background: var(--surface); box-shadow: none; }
.summary-item { display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 16px 18px; }
.summary-item > .muted-label { font-size: 13px; line-height: 20px; }
.summary-item + .summary-item { border-left: 1px solid var(--line-soft); }
.summary-value { font-size: 26px; line-height: 1.25; font-weight: 650; color: var(--text-main); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.summary-value--empty { font-size: 20px; color: var(--text-sub); }
.summary-note { font-size: 13px; color: var(--text-sub); }
@media (max-width: 760px) {
  .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .summary-item { padding: 14px; }
  .summary-item:nth-child(3) { border-left: none; }
  .summary-item:nth-child(n + 3) { border-top: 1px solid var(--line-soft); }
}
</style>
