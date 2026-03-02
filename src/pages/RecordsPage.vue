<script setup lang="ts">
/**
 * RecordsPage — 每月記錄（PrimeVue + Tailwind）
 */
import { computed, ref } from "vue";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import Skeleton from "primevue/skeleton";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useAssetManagerStore } from "../stores";
import type { MonthlyRecord, Account } from "../types";

const toast = useToast();
const assetManager = useAssetManagerStore();
const {
  isLoading,
  accounts,
  selectedMonth,
  months
} = storeToRefs(assetManager);

const { 
  amountAtMonth, 
  toTwd, 
  bulkUpsertMonthlyRecords,
  formatCurrency, 
  accountDisplayName 
} = assetManager;

// --- 月份摘要 ---
const totalAssetTwd = computed(() =>
  accounts.value.filter(a => a.type === "asset")
    .reduce((s, a) => s + toTwd(amountAtMonth(a.id, selectedMonth.value), a.currency), 0)
);
const totalLiabTwd = computed(() =>
  accounts.value.filter(a => a.type === "liability")
    .reduce((s, a) => s + toTwd(amountAtMonth(a.id, selectedMonth.value), a.currency), 0)
);
const netWorthTwd = computed(() => totalAssetTwd.value - totalLiabTwd.value);

const assetAccounts   = computed(() => accounts.value.filter(a => a.type === "asset"));
const liabAccounts    = computed(() => accounts.value.filter(a => a.type === "liability"));

const isFirst = computed(() => months.value.length > 0 && selectedMonth.value === months.value[0]);
const isLast  = computed(() => months.value.length > 0 && selectedMonth.value === months.value[months.value.length - 1]);

function goToPrevMonth() {
  const idx = months.value.indexOf(selectedMonth.value);
  if (idx > 0) selectedMonth.value = months.value[idx - 1];
}

function goToNextMonth() {
  const idx = months.value.indexOf(selectedMonth.value);
  if (idx < months.value.length - 1) selectedMonth.value = months.value[idx + 1];
}

// --- 月差 ---
function prevMonthStr() {
  const [y, m] = selectedMonth.value.split("-").map(Number);
  return m === 1 ? `${y-1}-12` : `${y}-${String(m-1).padStart(2,"0")}`;
}
function deltaFor(account: Account) {
  return amountAtMonth(account.id, selectedMonth.value) - amountAtMonth(account.id, prevMonthStr());
}

// --- 編輯 ---
const editVisible  = ref(false);
const editAccount  = ref<Account | null>(null);
const editValue    = ref<number | null>(null);
const isSaving     = ref(false);

function openEdit(account: Account) {
  editAccount.value = account;
  editValue.value   = amountAtMonth(account.id, selectedMonth.value);
  editVisible.value = true;
}

async function save() {
  if (!editAccount.value || editValue.value === null) return;
  isSaving.value = true;
  try {
    await bulkUpsertMonthlyRecords(selectedMonth.value, [
      { accountId: editAccount.value.id, amount: editValue.value }
    ]);
    toast.add({ severity: "success", summary: "儲存成功", life: 2000 });
    editVisible.value = false;
  } catch {
    toast.add({ severity: "error", summary: "儲存失敗，請稍後再試", life: 3000 });
  } finally {
    isSaving.value = false;
  }
}

const fmtTwd = (v: number) =>
  new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 }).format(v);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 pt-6 pb-24">

    <!-- 月份導覽 -->
    <div class="flex items-center justify-center gap-2 mb-4">
      <Button icon="pi pi-chevron-left" rounded text :disabled="isFirst" @click="goToPrevMonth" aria-label="上個月" />
      <span class="text-xl font-extrabold text-[var(--text-main)] min-w-28 text-center whitespace-nowrap">
        {{ selectedMonth }}
      </span>
      <Button icon="pi pi-chevron-right" rounded text :disabled="isLast" @click="goToNextMonth" aria-label="下個月" />
    </div>

    <!-- 月份摘要 -->
    <div class="flex items-stretch rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] shadow-sm mb-5 overflow-hidden">
      <div class="flex-1 flex flex-col items-center py-3 gap-0.5">
        <span class="text-[10px] font-semibold text-[var(--text-sub)] uppercase tracking-wide">資產</span>
        <span class="text-sm font-extrabold tabular-nums text-green-600">{{ fmtTwd(totalAssetTwd) }}</span>
      </div>
      <div class="w-px bg-[var(--line-soft)]" />
      <div class="flex-1 flex flex-col items-center py-3 gap-0.5">
        <span class="text-[10px] font-semibold text-[var(--text-sub)] uppercase tracking-wide">負債</span>
        <span class="text-sm font-extrabold tabular-nums text-red-500">{{ fmtTwd(totalLiabTwd) }}</span>
      </div>
      <div class="w-px bg-[var(--line-soft)]" />
      <div class="flex-1 flex flex-col items-center py-3 gap-0.5">
        <span class="text-[10px] font-semibold text-[var(--text-sub)] uppercase tracking-wide">淨值</span>
        <span class="text-sm font-extrabold tabular-nums" :class="netWorthTwd >= 0 ? 'text-green-600' : 'text-red-500'">
          {{ fmtTwd(netWorthTwd) }}
        </span>
      </div>
    </div>

    <!-- 資產列表 -->
    <section class="mb-6">
      <div class="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider mb-2 px-1">資產</div>
      <div v-if="isLoading" class="flex flex-col gap-2">
        <Skeleton v-for="i in 4" :key="i" height="64px" borderRadius="12px" />
      </div>
      <div v-else-if="!assetAccounts.length" class="text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl">
        尚無資產帳戶
      </div>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="acc in assetAccounts" :key="acc.id"
          class="flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl px-3.5 py-3 cursor-pointer transition-all hover:border-primary hover:shadow-md active:scale-[0.99]"
          @click="openEdit(acc)" role="button" tabindex="0" @keydown.enter="openEdit(acc)"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-extrabold shrink-0"
               :style="{ background: acc.color ?? '#0f766e' }">
            {{ acc.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-[var(--text-main)] truncate">{{ accountDisplayName(acc) }}</div>
            <div class="text-[11px] text-[var(--text-sub)] mt-0.5">{{ acc.currency }} · {{ acc.category }}</div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-sm font-bold tabular-nums text-[var(--text-main)]">
              {{ formatCurrency(amountAtMonth(acc.id, selectedMonth), acc.currency) }}
            </div>
            <div
              v-if="deltaFor(acc) !== 0"
              class="text-[11px] font-semibold tabular-nums mt-0.5"
              :class="deltaFor(acc) > 0 ? 'text-green-600' : 'text-red-500'"
            >
              {{ deltaFor(acc) > 0 ? '+' : '' }}{{ formatCurrency(deltaFor(acc), acc.currency) }}
            </div>
          </div>
          <i class="pi pi-pencil text-xs text-[var(--text-sub)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </section>

    <!-- 負債列表 -->
    <section v-if="!isLoading && liabAccounts.length">
      <div class="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider mb-2 px-1">負債</div>
      <div class="flex flex-col gap-2">
        <div
          v-for="acc in liabAccounts" :key="acc.id"
          class="flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl px-3.5 py-3 cursor-pointer transition-all hover:border-red-400 hover:shadow-md active:scale-[0.99]"
          @click="openEdit(acc)" role="button" tabindex="0" @keydown.enter="openEdit(acc)"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-extrabold shrink-0"
               :style="{ background: acc.color ?? '#dc2626' }">
            {{ acc.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-[var(--text-main)] truncate">{{ accountDisplayName(acc) }}</div>
            <div class="text-[11px] text-[var(--text-sub)] mt-0.5">{{ acc.currency }} · {{ acc.category }}</div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-sm font-bold tabular-nums text-red-500">
              {{ formatCurrency(amountAtMonth(acc.id, selectedMonth), acc.currency) }}
            </div>
            <div
              v-if="deltaFor(acc) !== 0"
              class="text-[11px] font-semibold tabular-nums mt-0.5"
              :class="deltaFor(acc) > 0 ? 'text-red-500' : 'text-green-600'"
            >
              {{ deltaFor(acc) > 0 ? '+' : '' }}{{ formatCurrency(deltaFor(acc), acc.currency) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 編輯 Dialog -->
    <Dialog
      v-model:visible="editVisible"
      :header="editAccount ? accountDisplayName(editAccount) : '編輯'"
      modal :draggable="false"
      style="width: min(380px, 92vw)"
    >
      <div class="flex flex-col gap-3 py-2" v-if="editAccount">
        <p class="text-xs text-[var(--text-sub)] m-0">{{ editAccount.currency }} · {{ selectedMonth }}</p>
        <InputNumber
          v-model="editValue"
          :useGrouping="true"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          :autofocus="true"
          fluid
          inputClass="text-2xl font-bold text-right tabular-nums"
        />
      </div>
      <template #footer>
        <Button label="取消" text severity="secondary" @click="editVisible = false" />
        <Button label="儲存" :loading="isSaving" @click="save" />
      </template>
    </Dialog>
  </div>
</template>
