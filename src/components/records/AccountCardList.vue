<script setup lang="ts">
/**
 * AccountCardList — 帳戶卡片列表
 *
 * 每張卡片唯一的操作就是「編輯金額」。
 * 帳戶管理（新增/編輯/刪除）請走 RecordsPage 的「管理帳戶」按鈕。
 *
 * Props:
 *   accounts    - 帳戶列表（需過濾好資產或負債）
 *   type        - "asset" | "liability"
 *   selectedMonth - 當前月份
 *   loading     - 是否載入中
 *
 * Emits:
 *   edit-amount   - 點擊卡片編輯金額 (account)
 */
import Skeleton from "primevue/skeleton";
import Divider from "primevue/divider";
import type { Currency, AccountType } from "../../types";
import { formatCurrency } from "../../utils/formatters";

export interface AccountCardItem {
  id: string;
  name: string;
  category: string;
  currency: Currency;
  color?: string;
  amount: number;
  delta: number;
}

const props = defineProps<{
  accounts: AccountCardItem[];
  type: AccountType;
  selectedMonth: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "edit-amount": [account: AccountCardItem];
}>();

// 按分類分組
function groupByCategory(list: AccountCardItem[]): Record<string, AccountCardItem[]> {
  const groups: Record<string, AccountCardItem[]> = {};
  for (const acc of list) {
    const cat = acc.category || "未分類";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(acc);
  }
  return groups;
}

const defaultColor = props.type === "asset" ? "#0f766e" : "#dc2626";
const sectionColor = props.type === "asset" ? "bg-green-500" : "bg-red-500";
const borderHoverClass = props.type === "asset" ? "hover:border-[var(--primary)]" : "hover:border-[var(--negative)]";
</script>

<template>
  <section>
    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-2">
      <Skeleton v-for="i in 3" :key="i" height="64px" borderRadius="12px" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!accounts.length"
      class="text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl"
    >
      {{ type === "asset" ? "尚無資產帳戶" : "尚無負債帳戶" }}
    </div>

    <!-- 卡片列表 (分類顯示) -->
    <div v-else class="flex flex-col gap-6">
      <div
        v-for="(groupAccounts, catName) in groupByCategory(accounts)"
        :key="catName"
      >
        <!-- 分類標題 (仿 InvestmentsPage) -->
        <div class="flex items-center justify-between gap-3 mb-3">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-1.5 h-5 rounded-full" :class="sectionColor"></div>
            <h2 class="text-lg font-black text-[var(--text-main)] truncate">{{ catName }}</h2>
          </div>
          <span class="text-xs font-bold text-[var(--text-sub)] shrink-0">{{ groupAccounts.length }} 個帳戶</span>
        </div>

        <div class="apollo-card !p-0 overflow-hidden flex flex-col">
          <div
            v-for="acc in groupAccounts"
            :key="acc.id"
            class="flex items-center justify-between py-3 px-3 sm:px-4 border-b border-[var(--line-soft)] last:border-none cursor-pointer hover:bg-[var(--app-bg)] transition-colors"
            @click="emit('edit-amount', acc)"
            role="button"
            tabindex="0"
            @keydown.enter="emit('edit-amount', acc)"
          >
            <!-- 卡片左側 (純文字) -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex flex-col min-w-0">
                <span class="text-[15px] font-black text-[var(--text-main)] truncate">
                  {{ acc.name }}
                </span>
              </div>
            </div>

            <!-- 卡片右側 -->
            <div class="flex flex-col items-end shrink-0 ml-2">
              <div class="text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--text-main)]">
                {{ formatCurrency(acc.amount, acc.currency) }}
              </div>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span
                  v-if="acc.delta !== 0"
                  class="text-[12px] sm:text-[13px] font-bold tabular-nums"
                  :class="(type === 'asset' ? acc.delta > 0 : acc.delta < 0) ? 'text-[var(--positive)]' : 'text-[var(--negative)]'"
                >
                  {{ acc.delta > 0 ? "+" : "" }}{{ formatCurrency(acc.delta, acc.currency) }}
                </span>
                <span v-else class="text-[12px] sm:text-[13px] font-bold text-[var(--text-muted)]">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
