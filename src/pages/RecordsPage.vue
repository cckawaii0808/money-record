<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import { useIsDesktop } from "../composables/useIsDesktop";
import { useAssetManagerStore } from "../stores";
import PageHeader from "../components/common/PageHeader.vue";
import MonthNavigator from "../components/common/MonthNavigator.vue";
import AccountCardList from "../components/records/AccountCardList.vue";
import type { AccountCardItem, AccountDraft } from "../components/records/AccountCardList.vue";
import AccountManageDialog from "../components/records/AccountManageDialog.vue";
import { useAuth } from "../composables/useAuth";
import { isMockMode } from "../firebase";

const { isDesktop } = useIsDesktop();
const route = useRoute();
const toast = useToast();
const assetManager = useAssetManagerStore();
const { isLoading, accounts, records, selectedMonth, months } = storeToRefs(assetManager);
const { amountAtMonth, toTwd, bulkUpsertMonthlyRecords, formatCurrency } = assetManager;

const manageDialogVisible = ref(false);
const search = ref("");
// 首頁連結只初始化頁面篩選，不更動 store 的帳戶選取狀態。
const initialAccountId = ref(typeof route.query.account === "string" ? route.query.account : "");
type RecordFilter = "all" | "asset" | "liability" | "pending";
const activeFilter = ref<RecordFilter>(route.query.pending === "1" ? "pending" : "all");
const initialAccountName = computed(() => accounts.value.find((account) => account.id === initialAccountId.value)?.name ?? initialAccountId.value);
const filters: { value: RecordFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "asset", label: "資產" },
  { value: "liability", label: "負債" },
  { value: "pending", label: "待更新" },
];

const quickMonth = ref<string | null>(null);
const quickItems = ref<AccountCardItem[]>([]);
const drafts = ref<Record<string, AccountDraft>>({});
const listRef = ref<InstanceType<typeof AccountCardList> | null>(null);
const editVisible = ref(false);
const editMonth = ref("");
const editAccount = ref<AccountCardItem | null>(null);
const editValue = ref<number | null>(null);
const isSaving = ref(false);
const { user } = useAuth();
watch(() => user.value?.uid ?? null, () => {
  if (isMockMode) return;
  clearQuickDrafts();
  editVisible.value = false;
  editAccount.value = null;
  editValue.value = null;
  editMonth.value = "";
  manageDialogVisible.value = false;
  search.value = "";
  initialAccountId.value = "";
  isSaving.value = false;
}, { flush: "sync" });
const quickEditing = computed(() => quickMonth.value !== null);
const controlsLocked = computed(() => quickEditing.value || editVisible.value || isSaving.value);
// 編輯期間所有呈現與寫入均使用開啟時的月份，與全域月份狀態解耦。
const displayMonth = computed(() => quickMonth.value ?? (editVisible.value ? editMonth.value : selectedMonth.value));
const previousCalendarMonth = computed(() => {
  const [year, month] = displayMonth.value.split("-").map(Number);
  return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
});

const accountItems = computed<AccountCardItem[]>(() => {
  const latestRecords = new Map<string, { month: string; amount: number }>();
  const previousIds = new Set<string>();
  for (const record of records.value) {
    if (record.month <= previousCalendarMonth.value) previousIds.add(record.accountId);
    if (record.month > displayMonth.value) continue;
    const latest = latestRecords.get(record.accountId);
    if (!latest || latest.month < record.month) latestRecords.set(record.accountId, record);
  }
  return accounts.value.map((account) => {
    const latest = latestRecords.get(account.id);
    const amount = amountAtMonth(account.id, displayMonth.value);
    return {
      id: account.id,
      name: account.name,
      category: account.category || "未分類",
      type: account.type,
      currency: account.currency,
      amount,
      delta: previousIds.has(account.id) ? amount - amountAtMonth(account.id, previousCalendarMonth.value) : null,
      status: latest?.month === displayMonth.value ? "filled" : latest ? "carried" : "empty",
      sourceMonth: latest?.month ?? null,
    };
  });
});

const updatedCount = computed(() => accountItems.value.filter((account) => account.status === "filled").length);
const pendingCount = computed(() => accounts.value.length - updatedCount.value);
const visibleItems = computed(() => {
  if (quickEditing.value) return quickItems.value;
  const query = search.value.trim().toLocaleLowerCase();
  return accountItems.value.filter((account) => {
    const matchesFilter = activeFilter.value === "all"
      || (activeFilter.value === "pending" ? account.status !== "filled" : account.type === activeFilter.value);
    return matchesFilter && (!initialAccountId.value || initialAccountId.value.split(",").includes(account.id))
      && (!query || `${account.name} ${account.category} ${account.currency} ${account.type === 'asset' ? '資產' : '負債'}`.toLocaleLowerCase().includes(query));
  });
});

const summary = computed(() => {
  let asset = 0;
  let liability = 0;
  for (const account of accountItems.value) {
    const amount = toTwd(account.amount, account.currency);
    if (account.type === "asset") asset += amount;
    else liability += amount;
  }
  return { asset, liability, net: asset - liability };
});

function isDraftInvalid(draft: AccountDraft) {
  return draft.value.trim() === "" || !Number.isFinite(Number(draft.value));
}

const pendingDrafts = computed(() => quickItems.value.filter((account) => {
  const draft = drafts.value[account.id];
  return draft && (isDraftInvalid(draft) || Number(draft.value) !== draft.original);
}));
const invalidDrafts = computed(() => pendingDrafts.value.filter((account) => isDraftInvalid(drafts.value[account.id])));
const editDirty = computed(() => editVisible.value && editAccount.value !== null && editValue.value !== editAccount.value.amount);
const hasUnsavedDrafts = computed(() => pendingDrafts.value.length > 0 || editDirty.value);

function changeMonth(month: string) {
  if (!controlsLocked.value) selectedMonth.value = month;
}

async function startQuickRecord() {
  if (controlsLocked.value || isLoading.value || !visibleItems.value.length) return;
  quickItems.value = visibleItems.value.map((account) => ({ ...account }));
  drafts.value = Object.fromEntries(quickItems.value.map((account) => [account.id, {
    value: String(account.amount), original: account.amount,
  }]));
  quickMonth.value = selectedMonth.value;
  await nextTick();
  listRef.value?.focusAmount();
}

function updateDraft(id: string, value: string) {
  if (isSaving.value || !drafts.value[id]) return;
  drafts.value[id].value = value;
}

function clearQuickDrafts() {
  quickMonth.value = null;
  drafts.value = {};
  quickItems.value = [];
}

function cancelQuickRecord() {
  if (isSaving.value) return;
  if (pendingDrafts.value.length && !window.confirm("取消快速記錄並丟棄所有未儲存草稿？")) return;
  clearQuickDrafts();
}

async function saveQuickRecord() {
  if (isSaving.value || !quickMonth.value || !pendingDrafts.value.length) return;
  if (invalidDrafts.value.length) {
    toast.add({ severity: "warn", summary: "請填入有效餘額，空白不會視為 0", life: 3000 });
    listRef.value?.focusAmount(invalidDrafts.value[0].id);
    return;
  }
  const month = quickMonth.value;
  const entries = pendingDrafts.value.map((account) => ({ accountId: account.id, amount: Number(drafts.value[account.id].value) }));
  isSaving.value = true;
  try {
    const result = await bulkUpsertMonthlyRecords(month, entries);
    if (result.type === "error") {
      toast.add({ severity: "error", summary: "儲存失敗", detail: result.message, life: 4000 });
      return;
    }
    clearQuickDrafts();
    toast.add({ severity: "success", summary: `已儲存 ${month} 的 ${entries.length} 筆紀錄`, life: 2500 });
  } finally {
    isSaving.value = false;
  }
}

function openEdit(account: AccountCardItem) {
  if (controlsLocked.value) return;
  editMonth.value = selectedMonth.value;
  editAccount.value = { ...account };
  editValue.value = account.amount;
  editVisible.value = true;
}

function closeEdit() {
  if (isSaving.value) return;
  if (editDirty.value && !window.confirm("取消編輯並丟棄未儲存的餘額？")) return;
  editVisible.value = false;
  editAccount.value = null;
  editValue.value = null;
}

function focusInput() {
  const input = document.getElementById("record-edit-amount") as HTMLInputElement | null;
  input?.focus();
  input?.select();
}

async function saveEdit() {
  if (isSaving.value || !editAccount.value || editValue.value === null || !Number.isFinite(editValue.value)) return;
  const month = editMonth.value;
  const entry = { accountId: editAccount.value.id, amount: editValue.value };
  isSaving.value = true;
  try {
    const result = await bulkUpsertMonthlyRecords(month, [entry]);
    if (result.type === "error") {
      toast.add({ severity: "error", summary: "儲存失敗", detail: result.message, life: 4000 });
      return;
    }
    editVisible.value = false;
    editAccount.value = null;
    toast.add({ severity: "success", summary: `已儲存 ${month} 的餘額`, life: 2000 });
  } finally {
    isSaving.value = false;
  }
}

onBeforeRouteLeave(() => {
  if (!isMockMode && !user.value) return true;
  if (isSaving.value) return false;
  return !hasUnsavedDrafts.value || window.confirm("尚有未儲存的餘額草稿，確定離開並丟棄？");
});

function beforeUnload(event: BeforeUnloadEvent) {
  if (!hasUnsavedDrafts.value && !isSaving.value) return;
  event.preventDefault();
  event.returnValue = "";
}
onMounted(() => window.addEventListener("beforeunload", beforeUnload));
onBeforeUnmount(() => window.removeEventListener("beforeunload", beforeUnload));
</script>

<template>
  <div class="workspace-page records-page" :class="{ 'records-page--editing': quickEditing }">
    <PageHeader title="每月記錄" :isDesktop="isDesktop">
      <fieldset class="month-controls" :disabled="controlsLocked" :aria-label="controlsLocked ? '編輯期間月份已鎖定' : '選擇月份'">
        <MonthNavigator :modelValue="displayMonth" :months="months" @update:modelValue="changeMonth" />
      </fieldset>
      <template #extra>
        <Button label="管理帳戶" icon="pi pi-cog" size="small" severity="secondary" :disabled="controlsLocked || isLoading" @click="manageDialogVisible = true" />
      </template>
    </PageHeader>

    <div class="records-content">
    <section class="workspace-panel records-summary" aria-label="本月摘要（折合台幣）" :aria-busy="isLoading">
      <div class="summary-item"><span class="muted-label">淨值 · TWD</span><strong>{{ isLoading ? '—' : formatCurrency(summary.net, 'TWD') }}</strong></div>
      <div class="summary-item"><span class="muted-label">資產 · TWD</span><strong>{{ isLoading ? '—' : formatCurrency(summary.asset, 'TWD') }}</strong></div>
      <div class="summary-item"><span class="muted-label">負債 · TWD</span><strong>{{ isLoading ? '—' : formatCurrency(summary.liability, 'TWD') }}</strong></div>
      <div class="summary-item summary-progress"><span class="muted-label">{{ displayMonth }} 已更新</span><strong>{{ isLoading ? '—' : `${updatedCount} / ${accounts.length}` }}<small v-if="!isLoading">待更新 {{ pendingCount }} 筆</small></strong></div>
    </section>

    <section class="workspace-panel records-panel" aria-labelledby="records-heading">
      <h2 id="records-heading" class="sr-only">帳戶餘額</h2>
      <div class="toolbar records-toolbar">
        <label class="search-field">
          <i class="pi pi-search" aria-hidden="true"></i>
          <input v-model="search" type="search" placeholder="搜尋帳戶、分類或幣別" aria-label="搜尋帳戶、分類或幣別" :disabled="controlsLocked" />
        </label>
        <div class="segmented-control records-filters" role="group" aria-label="帳戶篩選">
          <button v-for="filter in filters" :key="filter.value" type="button" :class="{ active: activeFilter === filter.value }" :aria-pressed="activeFilter === filter.value" :disabled="controlsLocked" @click="activeFilter = filter.value">
            {{ filter.label }}<span v-if="filter.value === 'pending'"> {{ pendingCount }}</span>
          </button>
        </div>
        <button v-if="initialAccountId" type="button" class="account-filter-chip" :disabled="controlsLocked" :aria-label="`清除 ${initialAccountName} 帳戶篩選`" @click="initialAccountId = ''">{{ initialAccountName }} <i class="pi pi-times" aria-hidden="true"></i></button>
        <span class="muted-label result-count">{{ visibleItems.length }} 個帳戶</span>
        <Button v-if="!quickEditing" label="快速記錄" icon="pi pi-pencil" size="small" :disabled="isLoading || controlsLocked || !visibleItems.length" @click="startQuickRecord" />
        <span v-else class="editing-month">正在記錄 {{ quickMonth }}</span>
      </div>

      <AccountCardList ref="listRef" :accounts="visibleItems" :selectedMonth="displayMonth" :loading="isLoading" :editing="quickEditing" :sortingLocked="controlsLocked" :saving="isSaving" :drafts="drafts" @edit-amount="openEdit" @update-draft="updateDraft" />

    </section>

    </div>
      <div v-if="quickEditing" class="quick-record-footer" role="region" aria-label="快速記錄儲存操作">
        <div aria-live="polite"><strong>{{ pendingDrafts.length }} 筆待儲存</strong><span v-if="invalidDrafts.length" class="invalid-message"> · {{ invalidDrafts.length }} 筆餘額無效</span></div>
        <div class="save-actions">
          <Button label="取消" size="small" severity="secondary" :disabled="isSaving" @click="cancelQuickRecord" />
          <Button :label="`儲存 ${pendingDrafts.length} 筆`" icon="pi pi-check" size="small" :loading="isSaving" :disabled="!pendingDrafts.length || !!invalidDrafts.length" @click="saveQuickRecord" />
        </div>
      </div>

    <AccountManageDialog :visible="manageDialogVisible" @update:visible="manageDialogVisible = $event" />

    <Dialog :visible="editVisible" :header="editAccount ? editAccount.name : '編輯餘額'" modal :draggable="false" :closable="!isSaving" :closeOnEscape="!isSaving" style="width: min(380px, 92vw)" @update:visible="!$event && closeEdit()" @show="focusInput">
      <div v-if="editAccount" class="single-edit-content">
        <p class="muted-label">{{ editAccount.currency }} · {{ editMonth }}<span v-if="editAccount.status === 'carried'"> · 沿用 {{ editAccount.sourceMonth }}</span></p>
        <InputNumber v-model="editValue" :useGrouping="false" :minFractionDigits="0" :maxFractionDigits="2" :disabled="isSaving" fluid inputId="record-edit-amount" :aria-label="`${editAccount.name} 原幣餘額`" inputClass="text-xl font-bold text-center tabular-nums" placeholder="請輸入餘額" @keydown.enter="saveEdit" />
      </div>
      <template #footer>
        <Button label="取消" text severity="secondary" :disabled="isSaving" @click="closeEdit" />
        <Button label="儲存" :loading="isSaving" :disabled="editValue === null || !Number.isFinite(editValue)" @click="saveEdit" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.records-content { width: 100%; min-width: 0; }
.month-controls { margin: 0; padding: 0; border: 0; min-width: 0; }
.month-controls:disabled { opacity: 0.6; }
.records-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 10px 14px; gap: 12px; margin-bottom: 12px; }
.summary-item { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.summary-item > span { font-size: 13px; }
.summary-item strong { color: var(--text-main); font-size: 22px; line-height: 1.25; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.summary-item small { display: inline; margin-left: 8px; font-size: 13px; font-weight: 400; color: var(--text-sub); white-space: nowrap; }
.records-panel { padding: 0; overflow: hidden; }
.records-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 18px 12px; }
.records-heading h2 { margin: 0; font-size: 0.9375rem; color: var(--text-main); }
.records-heading p { margin: 5px 0 0; font-size: 13px; line-height: 1.5; }
.records-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 10px 12px; }
.search-field { display: flex; align-items: center; gap: 8px; min-width: 180px; max-width: 300px; flex: 1; height: 34px; padding: 0 10px; border: 1px solid var(--line-soft); border-radius: 6px; color: var(--text-sub); background: var(--surface); }
.search-field .pi { font-size: 0.75rem; }
.search-field input { border: 0; outline: 0; width: 100%; min-width: 0; background: transparent; color: var(--text-main); font-size: 15px; }
.search-field:focus-within { outline: 2px solid var(--primary); }
.records-filters { display: inline-flex; gap: 2px; }
.records-filters button { padding: 6px 10px; border: 0; border-radius: 5px; font-size: 13px; background: transparent; color: var(--text-sub); cursor: pointer; white-space: nowrap; }
.records-filters button.active { background: var(--primary); color: white; }
.records-filters button:disabled, .search-field:has(input:disabled) { opacity: 0.6; cursor: default; }
.account-filter-chip { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 5px 8px; border: 1px solid var(--line-soft); border-radius: 5px; background: var(--app-bg); color: var(--text-main); font-size: 13px; cursor: pointer; overflow-wrap: anywhere; }
.account-filter-chip:disabled { opacity: 0.6; cursor: default; }
.account-filter-chip .pi { font-size: 12px; }
.result-count { margin-left: auto; font-size: 13px; white-space: nowrap; }
.editing-month { color: var(--primary); font-size: 13px; font-weight: 600; white-space: nowrap; }
.quick-record-bar { padding: 10px 18px; background: var(--app-bg); border-top: 1px solid var(--line-soft); font-size: 13px; line-height: 1.6; }
.quick-record-bar p { margin: 0; color: var(--text-main); }
.records-page--editing { padding-bottom: calc(112px + env(safe-area-inset-bottom)); }
.quick-record-footer { position: fixed; bottom: calc(12px + env(safe-area-inset-bottom)); left: 50%; transform: translateX(-50%); z-index: 55; width: min(1232px, calc(100% - 48px)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 18px; border: 1px solid var(--line-strong); border-radius: 10px; font-size: 15px; background: var(--surface-elev); box-shadow: 0 4px 20px rgb(0 0 0 / 12%); }
.quick-record-footer > div:first-child { min-width: 0; }
.quick-record-footer .invalid-message { display: block; font-size: 13px; }
.save-actions { display: flex; gap: 8px; flex-shrink: 0; }
.invalid-message { color: var(--negative); }
.records-note { margin: 0; padding: 10px 18px; border-top: 1px solid var(--line-soft); font-size: 12px; line-height: 1.6; }
.single-edit-content { display: flex; flex-direction: column; gap: 16px; padding-block: 8px; }
.single-edit-content p { margin: 0; font-size: 13px; line-height: 1.6; }
@media (max-width: 640px) {
  .records-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 12px; gap: 12px; }
  .summary-item small { display: block; margin: 3px 0 0; }
  .records-heading { padding: 12px; align-items: flex-start; }
  .records-heading p { max-width: 230px; }
   .records-toolbar { padding: 10px; gap: 8px; }
  .search-field { flex-basis: 100%; max-width: none; }
  .records-filters button { padding-inline: 8px; }
  .quick-record-bar, .records-note { padding-inline: 12px; }
  .quick-record-footer { width: calc(100% - 28px); padding: 12px; gap: 8px; font-size: 14px; }
  .save-actions { margin-left: auto; }
}
</style>
