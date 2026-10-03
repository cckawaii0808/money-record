<script setup lang="ts">
import { computed, ref } from "vue";
import Skeleton from "primevue/skeleton";
import { formatTwd } from "../../utils/formatters";
import type { Currency } from "../../types";

// 使用百分比分段條與同色明細呈現，避免固定高度裁切內容。
export interface DonutItem {
  id: string;
  accountName: string;
  category: string;
  netImpactTwd: number;
  current: number;
  currency: Currency;
}
const props = defineProps<{ items: DonutItem[]; month: string; loading?: boolean }>();
const emit = defineEmits<{ "open-records": [accountIds: string[]] }>();
const groupBy = ref<"account" | "category">("account");
const expanded = ref(false);
const palette = ["#168c83", "#5285cf", "#b48640", "#9473bb", "#ce7185", "#708698"];
const total = computed(() => props.items.reduce((sum, item) => sum + Math.max(0, item.netImpactTwd), 0));
const rows = computed(() => {
  const positiveItems = props.items.filter((item) => item.netImpactTwd > 0);
  if (groupBy.value === "account") {
    return positiveItems.map((item) => ({
      id: item.id, name: item.accountName, amount: item.netImpactTwd,
      accountIds: [item.id],
    })).sort((a, b) => b.amount - a.amount);
  }
  const groups = new Map<string, { id: string; name: string; amount: number; detail: string; accountIds: string[] }>();
  for (const item of positiveItems) {
    const name = item.category.trim() || "未分類";
    const group = groups.get(name) ?? { id: name, name, amount: 0, detail: "", accountIds: [] };
    group.amount += item.netImpactTwd;
    group.accountIds.push(item.id);
    group.detail = `${group.accountIds.length} 個帳戶・折合台幣`;
    groups.set(name, group);
  }
  return [...groups.values()].sort((a, b) => b.amount - a.amount);
});
function percentage(amount: number) {
  return total.value > 0 ? amount / total.value * 100 : 0;
}
function percentageLabel(amount: number) {
  const value = percentage(amount);
  return value > 0 && value < 0.1 ? "<0.1%" : `${value.toFixed(1)}%`;
}
const displayRows = computed(() => {
  const colored = rows.value.map((row, index) => ({ ...row, color: palette[index % palette.length] }));
  if (expanded.value || colored.length <= 5) return colored;
  const remaining = colored.slice(5);
  return [...colored.slice(0, 5), {
    id: "__allocation_other__", name: "其他", amount: remaining.reduce((sum, row) => sum + row.amount, 0),
    accountIds: remaining.flatMap((row) => row.accountIds), color: palette[5],
  }];
});
function setGroup(value: "account" | "category") {
  groupBy.value = value;
  expanded.value = false;
}
</script>

<template>
  <section class="workspace-panel allocation" :aria-busy="loading">
    <div class="allocation-heading toolbar">
      <div><h2 class="section-heading">資產配置</h2><p class="muted-label">{{ month }} · TWD</p></div>
      <div class="segmented-control" aria-label="配置分組">
        <button type="button" :class="{ active: groupBy === 'account' }" :aria-pressed="groupBy === 'account'" @click="setGroup('account')">帳戶</button>
        <button type="button" :class="{ active: groupBy === 'category' }" :aria-pressed="groupBy === 'category'" @click="setGroup('category')">分類</button>
      </div>
    </div>
    <Skeleton v-if="loading" width="100%" height="220px" />
    <p v-else-if="!rows.length" class="empty-state">尚無正餘額資產，新增紀錄後即可查看配置。</p>
    <template v-else>
      <div class="allocation-total"><span class="muted-label">資產合計</span><strong>{{ formatTwd(total) }}</strong></div>
      <div class="allocation-composition" role="img" :aria-label="displayRows.map(row => `${row.name} ${percentageLabel(row.amount)}`).join('，')">
        <span v-for="row in displayRows" :key="row.id" :style="{ width: `${percentage(row.amount)}%`, background: row.color }" :title="`${row.name} ${percentageLabel(row.amount)}`" />
      </div>
      <div class="allocation-column-labels"><span>{{ groupBy === 'account' ? '帳戶' : '分類' }}</span><span>金額 · TWD</span><span>占比</span></div>
      <div class="allocation-list">
        <button v-for="row in displayRows" :key="row.id" type="button" class="allocation-row" :aria-label="`${row.name}，占比 ${percentageLabel(row.amount)}，前往更新紀錄`" @click="emit('open-records', row.accountIds)">
          <span class="row-name"><span class="allocation-dot" :style="{ background: row.color }" />{{ row.name }}</span>
          <span class="row-amount">{{ formatTwd(row.amount) }}</span>
          <strong class="row-percentage">{{ percentageLabel(row.amount) }}</strong>
        </button>
      </div>
      <button v-if="rows.length > 5" type="button" class="expand-button" :aria-expanded="expanded" @click="expanded = !expanded">{{ expanded ? '收合' : `展開全部 ${rows.length} 項` }}<i :class="expanded ? 'pi pi-angle-up' : 'pi pi-angle-down'" aria-hidden="true" /></button>
    </template>
  </section>
</template>

<style scoped>
.allocation { min-width: 0; padding: 18px; background: var(--surface); border: 1px solid var(--line-soft); border-radius: 10px; box-shadow: none; }
.allocation-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.allocation-heading p { margin: 4px 0 0; font-size: 13px; }
.allocation-total { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin: 18px 0 12px; font-size: 13px; }
.allocation-total strong { font-size: 22px; font-variant-numeric: tabular-nums; color: var(--text-main); }
.allocation-composition { display: flex; height: 20px; width: 100%; border-radius: 5px; overflow: hidden; margin-bottom: 18px; }
.allocation-composition > span { height: 100%; flex-shrink: 0; }
.allocation-column-labels, .allocation-row { display: grid; grid-template-columns: minmax(0, 1fr) auto 64px; align-items: center; gap: 12px; }
.allocation-column-labels { font-size: 12px; color: var(--text-sub); padding-bottom: 8px; border-bottom: 1px solid var(--line-soft); }
.allocation-column-labels > span:not(:first-child) { text-align: right; }
.allocation-row { width: 100%; min-height: 44px; padding: 10px 0; text-align: left; color: var(--text-main); border: 0; border-bottom: 1px solid var(--line-soft); background: transparent; cursor: pointer; font-size: 15px; }
.allocation-row:hover { background: var(--app-bg); }
.row-name { display: flex; align-items: center; gap: 8px; min-width: 0; overflow-wrap: anywhere; }
.allocation-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.row-amount, .row-percentage { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.row-percentage { font-size: 14px; }
.expand-button { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; border: 0; background: transparent; color: var(--primary); padding: 12px 0 0; font-size: 13px; cursor: pointer; }
@media (max-width: 400px) { .allocation-column-labels, .allocation-row { gap: 8px; grid-template-columns: minmax(0, 1fr) auto 54px; } .allocation-row { font-size: 14px; } .row-percentage { font-size: 13px; } }
.allocation-footnote, .empty-state { font-size: 12px; color: var(--text-sub); line-height: 1.6; margin: 12px 0 0; }
.empty-state { padding: 35px 0; }
button:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
</style>
