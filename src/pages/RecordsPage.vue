<script setup lang="ts">
/**
 * RecordsPage — 每月記錄編輯
 *
 * 使用元件：
 *   PageHeader / MonthNavigator / KpiCard（共用）
 *   AccountCardList / AccountManageDialog（自訂）
 */
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useIsDesktop } from "../composables/useIsDesktop";
import { useAssetManagerStore } from "../stores";
import type { Account } from "../types";

// ── 共用元件 ──
import PageHeader from "../components/common/PageHeader.vue";
import MonthNavigator from "../components/common/MonthNavigator.vue";
import KpiCard from "../components/common/KpiCard.vue";

// ── Records 元件 ──
import AccountCardList from "../components/records/AccountCardList.vue";
import type { AccountCardItem } from "../components/records/AccountCardList.vue";
import AccountManageDialog from "../components/records/AccountManageDialog.vue";

// ── PrimeVue ──
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";

const { isDesktop } = useIsDesktop();
const toast = useToast();
const assetManager = useAssetManagerStore();

const {
  isLoading,
  accounts,
  selectedMonth,
  months,
} = storeToRefs(assetManager);

const {
  amountAtMonth,
  toTwd,
  bulkUpsertMonthlyRecords,
  formatCurrency,
} = assetManager;

// ── 管理帳戶 Dialog ──
const manageDialogVisible = ref(false);

// ── KPI 摘要 ──
const totalAssetTwd = computed(() =>
  accounts.value
    .filter((a) => a.type === "asset")
    .reduce((s, a) => s + toTwd(amountAtMonth(a.id, selectedMonth.value), a.currency), 0)
);

const totalLiabTwd = computed(() =>
  accounts.value
    .filter((a) => a.type === "liability")
    .reduce((s, a) => s + toTwd(amountAtMonth(a.id, selectedMonth.value), a.currency), 0)
);

const netWorthTwd = computed(() => totalAssetTwd.value - totalLiabTwd.value);

// ── 帳戶分類（給 AccountCardList 用） ──
function toCardItem(account: Account): AccountCardItem {
  const id = account.id;
  const month = selectedMonth.value;
  const [y, m] = month.split("-").map(Number);
  const prevMonth = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
  const amount = amountAtMonth(id, month);
  const prevAmount = amountAtMonth(id, prevMonth);
  return {
    id,
    name: account.name,
    category: account.category || "未分類",
    currency: account.currency,
    color: account.color,
    amount,
    delta: amount - prevAmount,
  };
}

const assetCardItems = computed(() =>
  accounts.value.filter((a) => a.type === "asset").map(toCardItem)
);

const liabCardItems = computed(() =>
  accounts.value.filter((a) => a.type === "liability").map(toCardItem)
);

const editVisible = ref(false);
const editAccount = ref<AccountCardItem | null>(null);
const editValue = ref<number | null>(null);
const isSaving = ref(false);
const amountInputRef = ref<any>(null);

function openEdit(acc: AccountCardItem) {
  editAccount.value = acc;
  editValue.value = acc.amount;
  editVisible.value = true;
}

function focusInput() {
  if (amountInputRef.value && amountInputRef.value.$el) {
    const input = amountInputRef.value.$el.querySelector("input");
    if (input) {
      input.focus();
      input.select();
    }
  }
}

async function saveEdit() {
  if (!editAccount.value || editValue.value === null) return;
  isSaving.value = true;
  try {
    await bulkUpsertMonthlyRecords(selectedMonth.value, [
      { accountId: editAccount.value.id, amount: editValue.value },
    ]);
    toast.add({ severity: "success", summary: "儲存成功", life: 2000 });
    editVisible.value = false;
  } catch {
    toast.add({ severity: "error", summary: "儲存失敗", life: 3000 });
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24 relative">
    <!-- 頁面標題 + 月份導航 + 管理帳戶按鈕 -->
    <PageHeader title="每月記錄" :isDesktop="isDesktop">
      <MonthNavigator
        :modelValue="selectedMonth"
        :months="months"
        @update:modelValue="selectedMonth = $event"
      />
      <template #extra>
        <Button
          label="管理帳戶"
          icon="pi pi-cog"
          size="small"
          severity="secondary"
          @click="manageDialogVisible = true"
        />
      </template>
    </PageHeader>

    <!-- (已移除內聯手機版管理帳戶按鈕，改為下方 FAB) -->

    <!-- KPI 總覽 (極簡純文字版) -->
    <section class="mb-6">
      <div v-if="isLoading" class="animate-pulse flex gap-8">
        <div class="h-12 bg-[var(--line-soft)] rounded w-32"></div>
      </div>
      <div v-else class="flex items-end justify-between">
        <div class="min-w-0">
          <div class="text-[13px] font-bold text-[var(--text-sub)] mb-1">本月淨值 (TWD)</div>
          <div class="text-[28px] sm:text-[36px] leading-tight font-black tabular-nums tracking-tight text-[var(--text-main)] truncate">
            {{ formatCurrency(Math.round(netWorthTwd), 'TWD') }}
          </div>
        </div>
        <div class="flex gap-4 sm:gap-6 text-right shrink-0 ml-4">
          <div>
            <div class="text-[12px] font-bold text-[var(--text-sub)] mb-1">總資產</div>
            <div class="text-[16px] sm:text-[18px] font-black tabular-nums text-[var(--positive)] leading-tight">
              {{ formatCurrency(Math.round(totalAssetTwd), 'TWD') }}
            </div>
          </div>
          <div>
            <div class="text-[12px] font-bold text-[var(--text-sub)] mb-1">總負債</div>
            <div class="text-[16px] sm:text-[18px] font-black tabular-nums text-[var(--negative)] leading-tight">
              {{ formatCurrency(Math.round(totalLiabTwd), 'TWD') }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 資產 / 負債雙欄 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- 資產區塊 -->
      <AccountCardList
        :accounts="assetCardItems"
        type="asset"
        :selectedMonth="selectedMonth"
        :loading="isLoading"
        @edit-amount="openEdit"
      />

      <!-- 負債區塊（沒資料時隱藏） -->
      <AccountCardList
        v-if="!isLoading && liabCardItems.length > 0"
        :accounts="liabCardItems"
        type="liability"
        :selectedMonth="selectedMonth"
        :loading="isLoading"
        @edit-amount="openEdit"
      />
    </div>

    <!-- 管理帳戶 Dialog（新增/編輯/刪除/排序） -->
    <AccountManageDialog
      :visible="manageDialogVisible"
      @update:visible="manageDialogVisible = $event"
    />

    <!-- 編輯當月金額 Dialog -->
    <Dialog
      :visible="editVisible"
      :header="editAccount ? editAccount.name : '編輯'"
      modal
      :draggable="false"
      style="width: min(380px, 92vw)"
      @update:visible="editVisible = $event"
      @show="focusInput"
    >
      <div class="flex flex-col gap-4 py-2" v-if="editAccount">
        <p class="text-xs text-[var(--text-sub)] text-center m-0">
          {{ editAccount.currency }} · {{ selectedMonth }}
        </p>

        <InputNumber
          ref="amountInputRef"
          v-model="editValue"
          :useGrouping="false"
          :minFractionDigits="0"
          :maxFractionDigits="2"
          :autofocus="true"
          fluid
          inputClass="text-2xl font-bold text-center tabular-nums"
          placeholder="0"
          @focus="editValue === 0 ? (editValue = null) : null"
          @blur="editValue === null ? (editValue = 0) : null"
          @keydown.enter="saveEdit"
        />
      </div>
      <template #footer>
        <div class="flex justify-center w-full gap-2 mt-2">
          <Button
            label="取消"
            text
            severity="secondary"
            @click="editVisible = false"
            class="flex-1"
          />
          <Button
            label="儲存"
            :loading="isSaving"
            @click="saveEdit"
            class="flex-1"
          />
        </div>
      </template>
    </Dialog>

    <!-- ─── 手機版懸浮管理帳戶按鈕 (FAB) ─── -->
    <div v-if="!isDesktop" class="fixed bottom-24 right-6 z-[100]">
      <Button
        icon="pi pi-cog"
        class="!w-14 !h-14 shadow-xl !bg-[var(--primary)] !border-none hover:scale-105 transition-transform"
        rounded
        aria-label="管理帳戶"
        @click="manageDialogVisible = true"
      />
    </div>
  </div>
</template>
