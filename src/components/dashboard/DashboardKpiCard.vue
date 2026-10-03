<script setup lang="ts">
import Skeleton from "primevue/skeleton";

defineProps<{
  loading?: boolean;
  netWorth: string;
  totalAsset: string;
  totalLiability: string;
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
        <span class="muted-label">淨資產 <span class="currency-badge">TWD</span></span>
        <strong class="summary-value summary-value--primary">{{ netWorth }}</strong>
      </div>
      <div class="summary-item">
        <span class="muted-label">總資產</span>
        <strong class="summary-value">{{ totalAsset }}</strong>
      </div>
      <div class="summary-item">
        <span class="muted-label">總負債</span>
        <strong class="summary-value">{{ totalLiability }}</strong>
      </div>
      <div class="summary-item">
        <span class="muted-label">淨資產月變動</span>
        <strong v-if="comparisonMonth" class="summary-value" :class="{ positive: (deltaValue ?? 0) > 0, negative: (deltaValue ?? 0) < 0 }">{{ delta }}</strong>
        <strong v-else class="summary-value summary-value--empty">無比較資料</strong>
        <span class="summary-note">
          <template v-if="comparisonMonth">對比 {{ comparisonMonth }}<template v-if="deltaPct != null">・{{ deltaPct > 0 ? '+' : '' }}{{ deltaPct.toFixed(1) }}%</template></template>
          <template v-else>尚無前一期紀錄</template>
        </span>
      </div>
    </template>
  </section>
</template>

<style scoped>
.summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 0; border: 1px solid var(--line-soft); border-radius: 10px; background: var(--surface); box-shadow: none; }
.summary-item { display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 18px 20px; }
.summary-item + .summary-item { border-left: 1px solid var(--line-soft); }
.summary-value { font-size: clamp(20px, 2.1vw, 28px); line-height: 1.2; font-weight: 650; color: var(--text-main); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.summary-value--primary { color: var(--primary); }
.summary-value--empty { font-size: 20px; color: var(--text-sub); }
.summary-note { font-size: 13px; color: var(--text-sub); }
.positive { color: var(--positive); }
.negative { color: var(--negative); }
@media (max-width: 760px) {
  .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .summary-item { padding: 14px; }
  .summary-item:nth-child(3) { border-left: none; }
  .summary-item:nth-child(n + 3) { border-top: 1px solid var(--line-soft); }
}
</style>
