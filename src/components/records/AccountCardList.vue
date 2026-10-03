<script setup lang="ts">
import { nextTick, ref } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Tooltip from "primevue/tooltip";
import type { AccountType, Currency } from "../../types";
import { useIsDesktop } from "../../composables/useIsDesktop";
import { amountColor, changeColor } from "../../utils/valueColors";

export interface AccountCardItem {
  id: string;
  name: string;
  category: string;
  type: AccountType;
  currency: Currency;
  amount: number;
  delta: number | null;
  status: "filled" | "carried" | "empty";
  sourceMonth: string | null;
}

export interface AccountDraft {
  value: string;
  original: number;
}

const props = defineProps<{
  accounts: AccountCardItem[];
  selectedMonth: string;
  loading?: boolean;
  editing?: boolean;
  sortingLocked?: boolean;
  saving?: boolean;
  drafts?: Record<string, AccountDraft>;
}>();

const emit = defineEmits<{
  "edit-amount": [account: AccountCardItem];
  "update-draft": [id: string, value: string];
}>();

const tableRef = ref<HTMLElement | null>(null);
const { isDesktop } = useIsDesktop();
const sortField = ref<string>();
const sortOrder = ref<number>();
const numberFormatter = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 });
const currencyPrefixes: Record<Currency, string> = { TWD: "NT$", USD: "US$", JPY: "JP¥" };
const statusLabels = { filled: "已儲存", carried: "沿用", empty: "未儲存" };
const vTooltip = Tooltip;
function saveStatus(account: AccountCardItem) {
  if (props.editing && draftChanged(account.id)) {
    return props.saving
      ? { label: "儲存中", icon: "pi pi-spinner pi-spin", className: "status-pending" }
      : { label: "未儲存", icon: "pi pi-pencil", className: "status-pending" };
  }
  const icons = { filled: "pi pi-check-circle", carried: "pi pi-history", empty: "pi pi-minus-circle" };
  return {
    label: account.status === "carried" ? `沿用 ${account.sourceMonth ?? ''}` : statusLabels[account.status],
    icon: icons[account.status], className: `status-${account.status}`,
  };
}
const categoryColors = ["#3986c9", "#9271c8", "#c18a35", "#c76991", "#448e80", "#748b40", "#6784ad", "#bb7352"];
function categoryStyle(category: string) {
  // 依名稱固定配色，不因排序或篩選改變。
  let hash = 0;
  for (const character of category) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return { "--category-color": categoryColors[hash % categoryColors.length] };
}

function draftInvalid(id: string) {
  const value = props.drafts?.[id]?.value;
  return value !== undefined && (value.trim() === "" || !Number.isFinite(Number(value)));
}

function draftChanged(id: string) {
  const draft = props.drafts?.[id];
  return draft && (draftInvalid(id) || Number(draft.value) !== draft.original);
}

function focusAmount(id?: string) {
  const inputs = tableRef.value?.querySelectorAll<HTMLInputElement>("input[data-amount-id]");
  const input = id ? Array.from(inputs ?? []).find((item) => item.dataset.amountId === id) : inputs?.[0];
  input?.focus();
  input?.select();
}

async function advance(event: KeyboardEvent, id: string) {
  if (event.isComposing || props.saving) return;
  event.preventDefault();
  if (draftInvalid(id)) return;
  // Enter 僅移動焦點，儲存狀態以實際金額差異與 API 結果判定。
  await nextTick();
  const inputs = Array.from(tableRef.value?.querySelectorAll<HTMLInputElement>("input[data-amount-id]:not(:disabled)") ?? []);
  const index = inputs.findIndex((input) => input.dataset.amountId === id);
  const next = inputs[index + 1];
  next?.focus();
  next?.select();
}

function rowClass(account: AccountCardItem) {
  return props.editing && draftChanged(account.id) ? "draft-row" : "";
}

defineExpose({ focusAmount });
</script>

<template>
  <div ref="tableRef" class="records-table-wrap" :aria-busy="loading || saving">
    <p v-if="loading" class="table-message muted-label" role="status">正在載入帳戶紀錄…</p>
    <DataTable
      v-else
      v-model:sortField="sortField"
      v-model:sortOrder="sortOrder"
      :value="accounts"
      dataKey="id"
      class="data-table records-table"
      size="small"
      :resizableColumns="isDesktop"
      columnResizeMode="fit"
      :rowClass="rowClass"
      :tableProps="{ 'aria-label': `${selectedMonth} 帳戶原幣餘額與更新狀態` }"
    >
      <template #empty><p class="table-message muted-label">沒有符合條件的帳戶，請調整篩選或至「管理帳戶」新增。</p></template>
      <Column field="name" header="帳戶名稱" :sortable="!editing && !sortingLocked && !saving" headerClass="name-column" bodyClass="name-column">
        <template #body="{ data: account }">
            <button v-if="!editing" type="button" class="account-name" :disabled="saving" :aria-label="`編輯 ${account.name} 的 ${selectedMonth} 餘額`" @click="emit('edit-amount', account)">
              {{ account.name }}
            </button>
            <span v-else class="account-name">{{ account.name }}</span>
            <div class="mobile-meta">
              <Tag :value="account.type === 'asset' ? '資產' : '負債'" :severity="account.type === 'asset' ? 'success' : 'warn'" class="type-tag" />
               <Tag :value="account.category" severity="secondary" class="category-tag" :style="categoryStyle(account.category)" />
            </div>
        </template>
      </Column>
      <Column field="category" header="分類" :sortable="!editing && !sortingLocked && !saving" headerClass="category-column" bodyClass="category-column">
        <template #body="{ data: account }"><Tag :value="account.category" severity="secondary" class="category-tag" :style="categoryStyle(account.category)" :title="account.category" /></template>
      </Column>
      <Column field="type" header="類型" :sortable="!editing && !sortingLocked && !saving" headerClass="type-column" bodyClass="type-column">
        <template #body="{ data: account }"><Tag :value="account.type === 'asset' ? '資產' : '負債'" :severity="account.type === 'asset' ? 'success' : 'warn'" class="type-tag" /></template>
      </Column>
      <Column field="amount" header="金額" :sortable="!editing && !sortingLocked && !saving" headerClass="amount-column" bodyClass="amount-column">
        <template #body="{ data: account }">
          <div v-if="editing" class="amount-editor" :class="{ 'invalid-input': draftInvalid(account.id), 'amount-disabled': saving }">
             <span class="amount-prefix" aria-hidden="true">{{ currencyPrefixes[account.currency as Currency] }}</span>
             <input
              :data-amount-id="account.id"
              :value="drafts?.[account.id]?.value"
              type="number"
              step="0.01"
              inputmode="decimal"
              class="balance-input"
              :class="{ 'invalid-input': draftInvalid(account.id) }"
              :disabled="saving"
              :aria-label="`${account.name} ${account.currency} 餘額`"
              :aria-invalid="draftInvalid(account.id)"
              @input="emit('update-draft', account.id, ($event.target as HTMLInputElement).value)"
              @keydown.enter="advance($event, account.id)"
             />
          </div>
             <button v-else type="button" class="amount-button" :disabled="saving" :aria-label="`編輯 ${account.name} 餘額 ${numberFormatter.format(account.amount)} ${account.currency}`" @click="emit('edit-amount', account)">
               <span class="amount-prefix" aria-hidden="true">{{ currencyPrefixes[account.currency as Currency] }}</span>
               <span class="amount-value" :class="amountColor(account.status === 'empty' ? null : account.amount)">{{ account.status === 'empty' ? '—' : numberFormatter.format(account.amount) }}</span>
            </button>
        </template>
      </Column>
      <Column field="delta" header="較上月" :sortable="!editing && !sortingLocked && !saving" headerClass="delta-column" bodyClass="delta-column">
        <template #body="{ data: account }">
          <span class="tabular-nums" :class="changeColor(account.delta == null ? null : account.type === 'liability' ? -account.delta : account.delta)">
            {{ account.delta === null ? '—' : `${account.delta > 0 ? '+' : ''}${numberFormatter.format(account.delta)}` }}
          </span>
        </template>
      </Column>
      <Column field="status" header="儲存狀態" :sortable="!editing && !sortingLocked && !saving" headerClass="status-column" bodyClass="status-column">
        <template #body="{ data: account }">
             <div class="status-content">
               <button type="button" v-tooltip.top="{ value: saveStatus(account).label, autoHide: false }" class="record-status" :class="saveStatus(account).className" :aria-label="`${account.name}：${saveStatus(account).label}`" :title="saveStatus(account).label">
                 <i :class="saveStatus(account).icon" aria-hidden="true" />
               </button>
            </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.records-table-wrap { min-width: 0; }
.records-table { width: 100%; font-size: 15px; }
.records-table :deep(.p-datatable-table) { width: 100%; table-layout: fixed; border-collapse: collapse; }
.records-table :deep(.p-datatable-thead > tr > th), .records-table :deep(.p-datatable-tbody > tr > td) { box-sizing: border-box; height: 36px; padding: 3px 10px; border-bottom: 1px solid var(--line-soft); vertical-align: middle; }
.records-table :deep(.p-datatable-thead > tr > th) { color: var(--text-sub); font-size: 13px; font-weight: 600; background: var(--app-bg); }
.records-table :deep(.p-datatable-tbody > tr > td) { font-size: 15px; }
.records-table :deep(.p-datatable-tbody > tr:hover) { background: var(--app-bg); }
.records-table :deep(.name-column) { width: 24%; text-align: left; }
.records-table :deep(.category-column) { width: 18%; }
.records-table :deep(.type-column) { width: 10%; }
.records-table :deep(.amount-column) { width: 23%; text-align: center; }
.records-table :deep(.delta-column) { width: 13%; text-align: right; }
.records-table :deep(.status-column) { width: 12%; text-align: center; }
.records-table :deep(.p-datatable-thead > tr > th:first-child), .records-table :deep(.p-datatable-tbody > tr > td:first-child) { padding-left: 16px; }
.records-table :deep(.p-datatable-thead > tr > th:last-child), .records-table :deep(.p-datatable-tbody > tr > td:last-child) { padding-right: 16px; }
.records-table :deep(.amount-column .p-datatable-column-header-content) { justify-content: center; }
.records-table :deep(.status-column .p-datatable-column-header-content) { justify-content: center; }
.records-table :deep(.delta-column .p-datatable-column-header-content) { justify-content: flex-end; }
.records-table :deep(.p-datatable-sort-icon) { width: 12px; height: 12px; }
.records-table :deep(.p-datatable-column-resizer) { width: 8px; cursor: col-resize; }
.records-table :deep(.p-datatable-column-resizer:hover) { background: var(--primary-ring); }
.account-name { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-main); font-weight: 600; }
button.account-name, .amount-button { border: 0; padding: 0; background: transparent; cursor: pointer; font: inherit; color: var(--text-main); }
button.account-name { font-weight: 600; text-align: left; }
button.account-name:hover { color: var(--primary); text-decoration: underline; }
.amount-button, .amount-editor { display: flex; align-items: center; gap: 5px; width: min(100%, 180px); min-height: 30px; margin-inline: auto; padding: 3px 8px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); font-variant-numeric: tabular-nums; }
.amount-button { border-color: transparent; background: transparent; }
.amount-button:hover { background: var(--app-bg); }
.amount-button:focus-visible, .amount-editor:focus-within { outline: 2px solid var(--primary); outline-offset: 1px; }
.amount-value { text-align: right; overflow-wrap: anywhere; }
.amount-value { flex: 1; min-width: 0; }
.amount-prefix { flex-shrink: 0; color: var(--text-sub); font-size: 13px; font-weight: 400; }
.amount-editor.invalid-input { border-color: var(--negative); }
.amount-disabled { opacity: .6; }
.category-tag { max-width: 100%; padding: 2px 7px; background: color-mix(in srgb, var(--category-color) 12%, var(--surface)); color: color-mix(in srgb, var(--category-color) 70%, var(--text-main)); border: 1px solid color-mix(in srgb, var(--category-color) 32%, var(--line-soft)); border-radius: 4px; font-size: 13px; font-weight: 500; }
.category-tag :deep(.p-tag-label) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.type-tag { font-size: 12px; padding: 2px 6px; white-space: nowrap; }
.records-table :deep(.currency-badge) { font-size: 12px; }
.tabular-nums { font-variant-numeric: tabular-nums; }
.delta-positive { color: var(--positive); }
.delta-negative { color: var(--negative); }
.record-status { display: inline-grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 5px; background: transparent; font-size: 17px; cursor: help; }
.record-status:hover, .record-status:focus-visible { background: var(--app-bg); }
.status-filled { color: var(--positive); }
.status-pending { color: var(--warn); }
.status-carried { color: var(--text-sub); }
.status-empty { color: var(--text-muted, var(--text-sub)); }
.status-content { display: flex; align-items: center; justify-content: center; }
.status-content.editing-status { flex-direction: column; align-items: flex-start; gap: 0; line-height: 18px; }
.confirm-label { display: inline-flex; gap: 4px; align-items: center; font-size: 12px; color: var(--text-sub); white-space: nowrap; cursor: pointer; }
.confirm-label input { margin: 0; accent-color: var(--primary); }
.balance-input { flex: 1; width: 100%; min-width: 0; height: 22px; padding: 0; border: 0; outline: none; background: transparent; color: var(--text-main); font: inherit; font-variant-numeric: tabular-nums; text-align: right; box-sizing: border-box; }
.balance-input::-webkit-inner-spin-button, .balance-input::-webkit-outer-spin-button { appearance: none; margin: 0; }
.records-table :deep(.draft-row) { background: color-mix(in srgb, var(--primary) 5%, transparent); }
.table-message { margin: 0; padding: 32px 16px; text-align: center; font-size: 15px; }
.mobile-meta { display: none; }
@media (max-width: 640px) {
   .records-table :deep(.category-column), .records-table :deep(.type-column), .records-table :deep(.delta-column) { display: none; }
  .records-table :deep(.name-column) { width: 40%; }
   .records-table :deep(.amount-column) { width: 39%; }
   .records-table :deep(.status-column) { width: 21%; }
   .amount-button, .amount-editor { gap: 5px; }
  .records-table :deep(.p-datatable-thead > tr > th), .records-table :deep(.p-datatable-tbody > tr > td) { padding: 7px 8px; }
  .mobile-meta { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-top: 4px; font-size: 12px; font-weight: 400; }
  .mobile-meta .type-tag { padding: 0 4px; }
  .mobile-meta > span { overflow-wrap: anywhere; }
   .status-content { justify-content: center; }
}
</style>
