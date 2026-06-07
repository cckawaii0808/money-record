<script setup lang="ts">
/**
 * TopChangesCard — 本月異動最多項目 Top 5
 *
 * 顯示本月增減幅度最大的前 5 個帳戶，讓使用者快速掌握「錢去哪了」。
 *
 * Props:
 *   rows - 帳戶快照資料（需包含 delta, accountName, currency, type）
 */
import Tag from "primevue/tag";
import type { Currency } from "../../types";
import { formatCurrency } from "../../utils/formatters";

export interface ChangeItem {
  accountName: string;
  delta: number;
  currency: Currency;
  type: "asset" | "liability";
}

const props = defineProps<{
  rows: ChangeItem[];
}>();

/** 依異動絕對值排序取前 5 */
const topChanges = () => {
  return [...props.rows]
    .filter((r) => r.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 5);
};
</script>

<template>
  <div class="apollo-card flex flex-col min-h-[340px]">
    <div class="flex items-center justify-between mb-6">
      <span class="text-[17px] font-bold text-[var(--text-main)]">
        本月異動重點
      </span>
      <Tag
        value="Top 5"
        severity="info"
        class="shadow-none bg-[var(--app-bg)] text-[var(--text-sub)] font-bold text-[10px]"
      />
    </div>

    <div class="flex-1 flex flex-col">
      <div v-if="!topChanges().length" class="text-center text-sm text-[var(--text-sub)] py-8">
        本月無異動
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="(item, idx) in topChanges()"
          :key="item.accountName + idx"
          class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--app-bg)] transition-colors"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="w-6 h-6 rounded-full bg-[var(--app-bg)] flex items-center justify-center text-xs font-bold text-[var(--text-sub)] shrink-0"
            >
              {{ idx + 1 }}
            </span>
            <div class="flex flex-col min-w-0">
              <span
                class="text-[14px] font-bold text-[var(--text-main)] truncate max-w-[140px]"
              >
                {{ item.accountName }}
              </span>
              <Tag
                :value="item.type === 'asset' ? '資產' : '負債'"
                :severity="item.type === 'asset' ? 'success' : 'warn'"
                class="!text-[10px] !py-0 !px-1.5 w-fit mt-0.5"
              />
            </div>
          </div>

          <span
            class="text-[15px] font-black tabular-nums"
            :class="
              item.delta > 0
                ? 'text-[var(--positive)]'
                : 'text-[var(--negative)]'
            "
          >
            {{ item.delta > 0 ? "+" : "" }}{{ formatCurrency(item.delta, item.currency) }}
          </span>
        </div>
      </div>

      <div v-if="topChanges().length > 0" class="mt-auto pt-4 text-center">
        <span class="text-xs text-[var(--text-muted)] font-medium">
          依異動絕對值排序，顯示前 5 名
        </span>
      </div>
    </div>
  </div>
</template>
