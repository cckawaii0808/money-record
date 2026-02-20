<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import Sortable from "sortablejs";
import {
  NButton,
  NCard,
  NDatePicker,
  NInput,
  NInputNumber,
  NModal,
  NSelect,
  NSpace,
  NTag,
  NText,
  useMessage,
  NGrid,
  NGi,
  NRadioGroup,
  NRadioButton,
  NSkeleton,
  NPopselect,
  NSwitch
} from "naive-ui";
import { DATE_PICKER_YEAR_RANGE, TYPE_LABELS, categoryTagType } from "../constants";
import { formatInteger } from "../utils/formatters";
import { useAssetManager } from "../features/asset-manager/composables/useAssetManager";
import { resolveBankIcon } from "../features/asset-manager/utils/bankIcons";
import type { Account, AccountType, Currency } from "../types";

interface RecordRow {
  id: string;
  accountName: string;
  category: string;
  currency: Currency;
  amount: number;
  type: AccountType;
  rawAccount: Account;
}

const message = useMessage();
const {
  accounts,
  newAccount,
  currencyOptions,
  accountTypeOptions,
  selectedMonth,
  amountAtMonth,
  isMonthOutOfRange,
  bulkUpsertMonthlyRecords,
  addAccount,
  updateAccountById,
  reorderAccount,
  deleteAccount,
  isLoading
} = useAssetManager();

const categoryOptions = [
  { label: "生活費", value: "生活費" },
  { label: "活期存款", value: "活期存款" },
  { label: "現金", value: "現金" },
  { label: "銀行帳戶", value: "銀行帳戶" },
  { label: "股票", value: "股票" },
  { label: "基金", value: "基金" },
  { label: "信用卡", value: "信用卡" },
  { label: "貸款", value: "貸款" }
];

const gridCols = ref(4);
const gridOptions = [
  { label: '3欄', value: 3 },
  { label: '4欄', value: 4 },
  { label: '5欄', value: 5 },
  { label: '6欄', value: 6 },
  { label: '7欄', value: 7 },
  { label: '8欄', value: 8 },
];

function updateGridCols(val: number) {
  gridCols.value = val;
  if(typeof localStorage !== 'undefined') {
    localStorage.setItem('moneyrecord_grid_cols', String(val));
  }
}

const isDraggable = ref(false);

const editingMonth = ref(selectedMonth.value);
const draftAmountById = ref<Record<string, number>>({});
// 記錄上一次 buildDraft 時從 DB 讀到的值，用來判斷使用者是否真的改過
const committedAmountById = ref<Record<string, number>>({});
const showDeleteConfirm = ref(false); // Confirm dialog visibility

const monthValue = computed<number | null>({
  get() {
    if (!editingMonth.value) {
      return null;
    }
    const [year, month] = editingMonth.value.split("-").map(Number);
    return new Date(year, month - 1, 1).getTime();
  },
  set(value) {
    if (!value) {
      return;
    }
    const date = new Date(value);
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    editingMonth.value = `${date.getFullYear()}-${month}`;
  }
});

const displayMonth = computed(() => {
  if (!editingMonth.value) return "";
  const [year, month] = editingMonth.value.split("-");
  return `${year}年 ${month}月`;
});

function addMonth(delta: number): void {
  if (!editingMonth.value) return;
  const [year, month] = editingMonth.value.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  const nextMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  
  if (isMonthOutOfRange(date.getTime())) {
    message.warning("超過可選範圍啦！");
    return;
  }
  editingMonth.value = nextMonth;
  editingMonth.value = nextMonth;
}

function jumpToToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  editingMonth.value = `${year}-${month}`;
}

// TWD/JPY 不需要小數；USD 保留 2 位
function currencyPrecision(currency: Currency): number {
  return currency === "TWD" || currency === "JPY" ? 0 : 2;
}

function formatAmountForRow(value: number | null, currency: Currency): string {
  if (value === null) return "";
  const precision = currencyPrecision(currency);
  return new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  }).format(Math.max(0, value));
}

function inputParser(value: string): number | null {
  if (!value) return null;
  // 移除格式化字符（逗號、貨幣符號等），但保留小數點
  const clean = value.replace(/[^\d.]/g, "");
  if (!clean || clean === ".") return null;
  const num = Number(clean);
  return Number.isFinite(num) ? num : null;
}

function buildDraft(): void {
  const nextAmounts: Record<string, number> = {};
  for (const account of accounts.value) {
    nextAmounts[account.id] = amountAtMonth(account.id, editingMonth.value);
  }
  draftAmountById.value = nextAmounts;
  // 同步更新「上次提交的值」，讓 accounts watcher 知道哪些是 DB 原始值
  committedAmountById.value = { ...nextAmounts };
}

// 切換月份 → 整包重建
watch(editingMonth, buildDraft, { immediate: true });

// accounts 變動（新增/刪除/排序）→ 智慧合併：只保留使用者真正改過的草稿
watch(accounts, (newAccounts) => {
  const nextAmounts: Record<string, number> = {};
  const nextCommitted: Record<string, number> = {};
  for (const account of newAccounts) {
    const stored = amountAtMonth(account.id, editingMonth.value);
    const committed = committedAmountById.value[account.id]; // 上次建立 draft 時的 DB 值
    const draft = draftAmountById.value[account.id];
    nextCommitted[account.id] = stored;
    // 只有當 draft 跟上次 committed 不同時，才代表使用者真的改過
    if (draft !== undefined && draft !== committed) {
      nextAmounts[account.id] = draft;
    } else {
      // 沒改過（包含初始載入時 draft=0, committed=0 的情況）→ 用最新 DB 值
      nextAmounts[account.id] = stored;
    }
  }
  draftAmountById.value = nextAmounts;
  committedAmountById.value = nextCommitted;
}, { deep: true });

function resetDraft(): void {
  buildDraft();
  message.info("已還原本月資料", { duration: 1000 });
}

const isDirty = computed(() => {
  for (const account of accounts.value) {
    const precision = currencyPrecision(account.currency);
    const original = Number(amountAtMonth(account.id, editingMonth.value).toFixed(precision));
    const current = Number((draftAmountById.value[account.id] ?? 0).toFixed(precision));
    if (original !== current) {
      return true;
    }
  }
  return false;
});

async function saveAll(): Promise<void> {
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    const entries = accounts.value.map((account) => {
      const precision = currencyPrecision(account.currency);
      const amount = Math.max(0, Number((draftAmountById.value[account.id] ?? 0).toFixed(precision)));
      return { accountId: account.id, amount };
    });
    const result = await bulkUpsertMonthlyRecords(editingMonth.value, entries);
    if (result.type === "success") {
      message.success(result.message, { duration: 1000 });
      // 存完後強制把 draft 同步成實際儲存的值，讓 isDirty 歸零
      buildDraft();
      return;
    }
    message.error(result.message, { duration: 1000 });
  } finally {
    isSaving.value = false;
  }
}

// --- Navigation Guards ---
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault();
    e.returnValue = "";
  }
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  if(typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('moneyrecord_grid_cols');
      if (saved) {
         const val = parseInt(saved);
         if (val >= 3 && val <= 8) {
             gridCols.value = val;
         }
      }
  }
});

// onBeforeUnmount is already used below for Sortable, we will merge the logic there or just add another hook (Vue supports multiple).
// However, the tool replaces a block. Let's look at the TargetContent.

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    const answer = window.confirm("您有未儲存的變更，確定要離開嗎？");
    if (answer) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

function buildRows(type: AccountType): RecordRow[] {
  return accounts.value
    .filter((a) => a.type === type)
    .map((account) => ({
      id: account.id,
      accountName: account.name,
      category: account.category,
      currency: account.currency,
      amount: Math.max(0, Math.round(draftAmountById.value[account.id] ?? 0)),
      type: account.type,
      rawAccount: account // Pass raw account for editing
    }));
}

const assetRows = computed<RecordRow[]>(() => buildRows("asset"));
const liabilityRows = computed<RecordRow[]>(() => buildRows("liability"));

// --- Management Logic ---
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingAccountId = ref<string | null>(null);
const editingName = ref("");
const editingCategory = ref<string | null>(null);
const editingCurrency = ref<Currency>("TWD");
const isSaving = ref(false);

const newAccountCategoryProxy = computed({
  get: () => newAccount.value.category || null,
  set: (val: string | null) => {
    newAccount.value.category = val || "";
  }
});

const editingCategoryProxy = computed({
  get: () => editingCategory.value || null,
  set: (val: string | null) => {
    editingCategory.value = val || null;
  }
});
const isDeleting = ref(false);

// Refactored: Instead of NGrid, let's use a custom grid container for better SortableJS compatibility.
const assetListContainer = ref<HTMLElement | null>(null);
const liabilityListContainer = ref<HTMLElement | null>(null);
let assetSortable: Sortable | null = null;
let liabilitySortable: Sortable | null = null;

function initSortable(el: HTMLElement | null, type: AccountType): Sortable | null {
  if (!el) return null;
  return Sortable.create(el, {
    group: type, // Use unique group name ('asset' or 'liability') to strictly prevent cross-dragging
    draggable: ".grid-item:not(.ignore-sort)", // Ignore the static Add Card
    animation: 200,
    disabled: !isDraggable.value,
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    // Make the whole card draggable
    handle: ".record-card", 
    // Prevent dragging when interacting with these elements
    filter: ".n-input-number, .edit-btn, .n-input", 
    preventOnFilter: false, // Allow clicks on filtered elements
    onMove(evt) {
      // Prevent sorting past the "Add Account" card (which has class .ignore-sort)
      return !evt.related.classList.contains('ignore-sort');
    },
    onEnd(event) {
      const { oldIndex, newIndex } = event;
      if (oldIndex != null && newIndex != null && oldIndex !== newIndex) {
        // We need to map visual index back to the *global* account index.
        const rows = type === 'asset' ? assetRows.value : liabilityRows.value;
        
        // Safety check: ensure valid indices
        if (!rows[oldIndex] || !rows[newIndex]) return;

        const targetRow = rows[oldIndex];
        
        // Let's implement a 'local reorder' helper
        const all = [...accounts.value];
        const subset = rows.map(r => r.id); // IDs in current visual order
        const movedId = subset[oldIndex];
        
        // Remove from old position in subset
        subset.splice(oldIndex, 1);
        // Insert at new position in subset
        subset.splice(newIndex, 0, movedId);
        
        // Let's reconstruct the global array.
        // Filter out all items of `type` from global.
        const others = all.filter(a => a.type !== type);
        
        // Implementation:
        // 1. Extract all items of `type` from `accounts`.
        // 2. Reorder them.
        
        // Let's do exactly that: Find indices of all items of `type` in `accounts`.
        const globalIndices = all
             .map((acc, idx) => ({ acc, idx }))
             .filter(item => item.acc.type === type)
             .map(item => item.idx);
             
        // `globalIndices` are the positions in the main array that hold items of this type.
        // `subset` contains the IDs in the new desired order.
        
        // Actually, SortableJS gives us `oldIndex` and `newIndex` within the list.
        // Let's find the global index of the item that WAS at `oldIndex`.
        const movedItem = rows[oldIndex]; // The item that moved
        const globalFromIndex = accounts.value.findIndex(a => a.id === movedItem.id);
        
        // We need to find the destination global index.
        // The item currently at `newIndex` (in the visual list, BEFORE modification) is:
        const targetVisualItem = rows[newIndex];
        const globalTargetIndex = accounts.value.findIndex(a => a.id === targetVisualItem.id);
        
        // Call reorder.
        reorderAccount(globalFromIndex, globalTargetIndex).then((res) => {
          if (res.type === 'success') {
            message.success(res.message, { duration: 1000 });
          } else {
            message.error(res.message);
          }
        });
      }
    }
  });
}

// Watchers to initialize Sortable when elements are ready
watch(() => assetListContainer.value, (el) => {
  if (assetSortable) assetSortable.destroy();
  assetSortable = initSortable(el, 'asset');
});

watch(() => liabilityListContainer.value, (el) => {
  if (liabilitySortable) liabilitySortable.destroy();
  liabilitySortable = initSortable(el, 'liability');
});

watch(() => isDraggable.value, (val) => {
  if (assetSortable) assetSortable.option('disabled', !val);
  if (liabilitySortable) liabilitySortable.option('disabled', !val);
});

// Also re-init if they are recreated (e.g. data load) - though with `ref` it should be stable.

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  if (assetSortable) assetSortable.destroy();
  if (liabilitySortable) liabilitySortable.destroy();
});

function openAddModal(): void {
  newAccount.value = {
    name: "",
    category: "",
    type: "asset",
    currency: "TWD"
  };
  showAddModal.value = true;
}

async function handleAdd(): Promise<void> {
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    const result = await addAccount();
    if (result.type === "success") {
      message.success(result.message, { duration: 1000 });
      showAddModal.value = false;
      return;
    }
    message.error(result.message, { duration: 1000 });
  } finally {
    isSaving.value = false;
  }
}

function openEditModal(account: Account): void {
  editingAccountId.value = account.id;
  editingName.value = account.name;
  editingCategory.value = account.category || null;
  editingCurrency.value = account.currency;
  showEditModal.value = true;
  showDeleteConfirm.value = false; // Reset delete confirm state
}

async function handleEdit(): Promise<void> {
  if (!editingAccountId.value || isSaving.value) return;
  isSaving.value = true;
  try {
    const result = await updateAccountById(editingAccountId.value, {
      name: editingName.value,
      category: editingCategory.value || "",
      currency: editingCurrency.value
    });
    if (result.type === "success") {
      message.success(result.message, { duration: 1000 });
      showEditModal.value = false;
      return;
    }
    message.error(result.message, { duration: 1000 });
  } finally {
    isSaving.value = false;
  }
}

async function handleDelete(): Promise<void> {
  if (!editingAccountId.value || isDeleting.value) return;
  // Second confirmation check
  if (!showDeleteConfirm.value) {
    showDeleteConfirm.value = true;
    return;
  }
  
  isDeleting.value = true;
  try {
    const result = await deleteAccount(editingAccountId.value);
    if (result.type === "success") {
      message.success(result.message, { duration: 1000 });
      showEditModal.value = false;
      return;
    }
    message.error(result.message, { duration: 1000 });
  } finally {
    isDeleting.value = false;
  }
}

function tagType(type: AccountType): "success" | "warning" {
  return type === "asset" ? "success" : "warning";
}

const accountCountLabel = computed(() => `帳戶 ${accounts.value.length}`);
</script>

<template>
  <div class="page-container">
    <div class="toolbar-container">
      <div class="toolbar-month">
        <NButton quaternary circle size="small" class="nav-arrow" @click="addMonth(-1)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </template>
        </NButton>

        <div class="month-picker-wrapper">
          <div class="month-display">
            {{ displayMonth }}
            <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <NDatePicker
            v-model:value="monthValue"
            type="month"
            :clearable="false"
            :year-range="DATE_PICKER_YEAR_RANGE"
            :is-date-disabled="isMonthOutOfRange"
            class="custom-date-picker-overlay"
          />
        </div>

        <NButton quaternary circle size="small" class="nav-arrow" @click="addMonth(1)">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </template>
        </NButton>

        <div class="divider-vertical"></div>
        
        <NButton  size="small" class="" @click="jumpToToday" title="回到本月">
          今天
        </NButton>
      </div>
      
      <div class="toolbar-right">
        <div class="grid-selector-btn">
          <NPopselect :options="gridOptions" :value="gridCols" @update:value="updateGridCols" trigger="click" size="medium" scrollable>
            <NButton secondary size="small">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </template>
              {{ gridCols }}欄
            </NButton>
          </NPopselect>
        </div>
         <div class="drag-toggle">
          <NText depth="3" style="font-size: 12px; font-weight: 600;">拖曳排序</NText>
          <NSwitch v-model:value="isDraggable" size="small" />
        </div>

        <template v-if="isDirty">
          <NButton secondary size="small" @click="resetDraft">
            重置
          </NButton>

          <NButton type="primary" size="small" :disabled="accounts.length === 0 || isSaving" :loading="isSaving" @click="saveAll">
            儲存
          </NButton>
        </template>
        
      </div>
    </div>

    <!-- Record Entry View with Integrated Sorting -->
    <div>
      <div class="section-container">
        <div class="section-header">
          <div class="section-title">資產</div>
          <div class="section-line"></div>
        </div>
                <!-- Loading State: Skeleton -->
        <div v-if="isLoading" class="card-grid">
          <div v-for="i in 4" :key="i" class="grid-item">
            <div class="record-card" style="pointer-events: none;">
               <div class="card-header">
                 <div class="header-left">
                   <NSkeleton text style="width: 24px" />
                   <NSkeleton circle style="width: 24px; height: 24px" />
                 </div>
                 <div class="header-info" style="width: 100%">
                   <NSkeleton text style="width: 60%; margin-bottom: 4px" />
                   <NSkeleton text style="width: 40%" />
                 </div>
               </div>
               <div class="card-body">
                 <NSkeleton text style="width: 100%; height: 34px; border-radius: 4px" />
               </div>
            </div>
          </div>
        </div>

        <!-- Use a custom div container instead of NGrid to support SortableJS properly -->
        <!-- Pass the column count as a CSS variable -->
        <div v-else ref="assetListContainer" class="card-grid" :style="{ '--cols': gridCols }">
           <div v-for="(row, index) in assetRows" :key="row.id" class="grid-item">
            <div class="record-card" :class="{ 'is-draggable': isDraggable }">
              <div class="card-header">
                <!-- Sequence and Icon Group -->
                <div class="header-left">
                  <span class="seq-num">#{{ index + 1 }}</span>
                  <img class="bank-icon" :src="resolveBankIcon(row.accountName)" :alt="row.accountName" />
                </div>

                <div class="header-info">
                  <div class="account-name">{{ row.accountName }}</div>
                  <NTag size="tiny" :bordered="false" :type="categoryTagType(row.category)" class="category-tag">
                    {{ row.category }}
                  </NTag>
                </div>

                <div class="header-action">
                  <NButton quaternary circle size="tiny" class="edit-btn" @click.stop="openEditModal(row.rawAccount)">
                    <template #icon>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </template>
                  </NButton>
                </div>
              </div>
              
              <div class="card-body">
                <NInputNumber
                  v-model:value="draftAmountById[row.id]"
                  :min="0"
                  :step="100"
                  :precision="currencyPrecision(row.currency)"
                  size="medium"
                  :show-button="false"
                  :parse="inputParser"
                  :format="(v) => formatAmountForRow(v, row.currency)"
                  :input-props="{ inputmode: 'decimal', pattern: '[0-9.]*' }"
                  class="amount-input"
                  placeholder="0"
                >
                  <template #prefix>
                    <span class="currency-prefix">{{ row.currency }}</span>
                  </template>
                </NInputNumber>
              </div>
            </div>
           </div>
           
           <!-- Add Account Card -->
           <div class="grid-item ignore-sort">
             <div class="record-card add-card" @click="openAddModal">
               <div class="add-icon-wrapper">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <line x1="12" y1="5" x2="12" y2="19"></line>
                   <line x1="5" y1="12" x2="19" y2="12"></line>
                 </svg>
               </div>
               <div class="add-text">新增帳戶</div>
             </div>
           </div>
        </div>
      </div>

      <div v-if="liabilityRows.length > 0" class="section-container">
        <div class="section-header">
          <div class="section-title title-liability">負債</div>
          <div class="section-line line-liability"></div>
        </div>
        
        <div v-if="isLoading" class="card-grid">
          <div v-for="i in 2" :key="i" class="grid-item">
             <div class="record-card" style="pointer-events: none;">
               <div class="card-header">
                 <div class="header-left">
                   <NSkeleton text style="width: 24px" />
                   <NSkeleton circle style="width: 24px; height: 24px" />
                 </div>
                 <div class="header-info" style="width: 100%">
                   <NSkeleton text style="width: 60%; margin-bottom: 4px" />
                   <NSkeleton text style="width: 40%" />
                 </div>
               </div>
               <div class="card-body">
                 <NSkeleton text style="width: 100%; height: 34px; border-radius: 4px" />
               </div>
            </div>
          </div>
        </div>

        <div v-else ref="liabilityListContainer" class="card-grid" :style="{ '--cols': gridCols }">
           <div v-for="(row, index) in liabilityRows" :key="row.id" class="grid-item">
            <div class="record-card card-liability" :class="{ 'is-draggable': isDraggable }">
              <div class="card-header">
                <div class="header-left">
                  <span class="seq-num">#{{ index + 1 }}</span>
                  <img class="bank-icon" :src="resolveBankIcon(row.accountName)" :alt="row.accountName" />
                </div>
                
                <div class="header-info">
                  <div class="account-name">{{ row.accountName }}</div>
                  <NTag size="tiny" :bordered="false" :type="categoryTagType(row.category)" class="category-tag">
                    {{ row.category }}
                  </NTag>
                </div>
                
                <div class="header-action">
                   <NButton quaternary circle size="tiny" class="edit-btn" @click.stop="openEditModal(row.rawAccount)">
                    <template #icon>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </template>
                  </NButton>
                </div>
              </div>
              
              <div class="card-body">
                <NInputNumber
                  v-model:value="draftAmountById[row.id]"
                  :min="0"
                  :step="100"
                  :precision="currencyPrecision(row.currency)"
                  size="medium"
                  :show-button="false"
                  :parse="inputParser"
                  :format="(v) => formatAmountForRow(v, row.currency)"
                  :input-props="{ inputmode: 'decimal', pattern: '[0-9.]*' }"
                  class="amount-input"
                  placeholder="0"
                >
                  <template #prefix>
                    <span class="currency-prefix">{{ row.currency }}</span>
                  </template>
                </NInputNumber>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NModal v-model:show="showAddModal" preset="card" title="新增帳戶" :style="{ width: '420px' }">
      <div class="modal-form">
        <div class="form-row">
          <label class="form-label">名稱</label>
          <div class="form-control">
            <NInput v-model:value="newAccount.name" placeholder="例如：中信活儲" />
          </div>
        </div>
        
        <div class="form-row">
          <label class="form-label">分類</label>
          <div class="form-control">
            <NSelect 
              v-model:value="newAccountCategoryProxy" 
              filterable
              tag
              :options="categoryOptions"
              placeholder="例如：生活費" 
            />
          </div>
        </div>
        
        <div class="form-row">
          <label class="form-label">類型</label>
          <div class="form-control group-control">
            <NRadioGroup v-model:value="newAccount.type" name="accountTypeGroup" size="medium">
              <NRadioButton value="asset" label="資產" />
              <NRadioButton value="liability" label="負債" class="liability-radio" />
            </NRadioGroup>
            <NSelect v-model:value="newAccount.currency" :options="currencyOptions" placeholder="幣別" class="currency-select" />
          </div>
        </div>
      </div>
      <template #footer>
        <NSpace justify="end">
          <NButton secondary :disabled="isSaving" @click="showAddModal = false">取消</NButton>
          <NButton type="primary" :disabled="isSaving" :loading="isSaving" @click="handleAdd">新增</NButton>
        </NSpace>
      </template>
    </NModal>

    <NModal v-model:show="showEditModal" preset="card" title="編輯帳戶" :style="{ width: '420px' }">
      <div class="modal-form">
        <div class="form-row">
          <label class="form-label">名稱</label>
          <div class="form-control">
            <NInput v-model:value="editingName" placeholder="帳戶名稱" />
          </div>
        </div>
        
        <div class="form-row">
          <label class="form-label">分類</label>
          <div class="form-control">
          <NSelect 
              v-model:value="editingCategoryProxy" 
              filterable
              tag
              :options="categoryOptions"
              placeholder="例如：生活費" 
            />
          </div>
        </div>
        
        <div class="form-row">
          <label class="form-label">幣別</label>
          <div class="form-control">
            <NSelect v-model:value="editingCurrency" :options="currencyOptions" placeholder="幣別" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="edit-modal-footer">
          <NButton 
            v-if="!showDeleteConfirm" 
            type="error" 
            quaternary 
            :disabled="isSaving || isDeleting"
            @click="handleDelete"
          >
            刪除帳戶
          </NButton>
          <NButton 
            v-else 
            type="error" 
            :loading="isDeleting"
            :disabled="isSaving || isDeleting"
            @click="handleDelete"
          >
            確定刪除?
          </NButton>
          
          <div class="footer-actions">
            <NButton secondary :disabled="isSaving || isDeleting" @click="showEditModal = false">取消</NButton>
            <NButton type="primary" :loading="isSaving" :disabled="isSaving || isDeleting" @click="handleEdit">儲存</NButton>
          </div>
        </div>
      </template>
    </NModal>
  </div>
</template>

<style scoped>
.page-container {
  padding-bottom: 40px;
}

.toolbar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 24px;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--line-soft);
  flex-wrap: wrap;
  gap: 24px;
  position: sticky;
  top: 58px; /* Tweak to fit under global topbar */
  z-index: 10;
}

.toolbar-month {
  display: flex;
  align-items: center;
  gap: 2px;
}

.month-picker-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.custom-date-picker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.month-display {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  user-select: none;
  border: 1px solid transparent;
  position: relative;
  z-index: 1;
}

.month-display:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.month-display:hover .dropdown-icon {
  opacity: 0.6;
  transform: translateY(2px);
}

.dropdown-icon {
  opacity: 0.2;
  transition: all 0.2s ease;
}

.nav-arrow {
  color: var(--text-sub);
}

.nav-arrow:hover {
  color: var(--text-main);
  background-color: rgba(0, 0, 0, 0.04);
}

.divider-vertical {
  width: 1px;
  height: 20px;
  background-color: var(--line-soft);
  margin: 0 4px 0 8px;
}


.toolbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.drag-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.03);
  padding: 4px 10px;
  border-radius: 20px;
}

.section-container {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
  white-space: nowrap;
}

.title-liability {
  color: var(--negative);
}

.section-line {
  height: 1px;
  background: var(--line-soft);
  flex: 1;
}

  .line-liability {
    background: color-mix(in srgb, var(--negative) 20%, transparent);
  }
  
  .record-card {
    background: var(--surface);
    border: 1px solid var(--line-soft);
    border-radius: 12px;
    padding: 10px; /* Reduced padding for compact height */
    transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
    display: flex;
    flex-direction: column;
    gap: 8px; /* Reduced gap */
    position: relative;
    cursor: default;
    height: 100%;
    /* min-height removed */
  }
  
  .record-card.is-draggable {
    cursor: grab;
  }
  
  .record-card.is-draggable:active {
    cursor: grabbing;
  }

  .record-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--primary);
  }

  .sortable-ghost {
    opacity: 0.4;
    background: var(--surface);
    border: 1px dashed var(--primary);
  }

  .sortable-drag {
    opacity: 1;
    background: var(--surface);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
    z-index: 9999;
  }
  
  .card-liability:hover {
    border-color: var(--negative);
  }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.seq-num {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-sub);
  opacity: 0.5;
  font-family: monospace;
  min-width: 14px;
}

.bank-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--line-soft);
  background: var(--surface);
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start; /* Prevent tag from stretching */
}

.header-action {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  align-self: flex-start; /* Move button to top */
  margin-top: -2px; /* Slight adjustment upwards */
}

.record-card:hover .header-action {
  opacity: 1;
}

@media (hover: none) {
  .header-action {
    opacity: 1;
  }
}

.account-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-tag {
  font-size: 11px;
}

.card-body {
  width: 100%;
}

.amount-input {
  width: 100%;
}

:deep(.n-input-number .n-input) {
  border-radius: 8px;
  background-color: var(--app-bg);
}

:deep(.amount-input .n-input__input-el) {
  text-align: right;
  font-family: "SF Mono", "Cascadia Code", "Fira Code", monospace;
  font-weight: 600;
  color: var(--text-main);
}

:deep(.centered-input .n-input__input-el),
:deep(.centered-input .n-base-selection-label) {
  text-align: center;
}

.currency-prefix {
  font-size: 12px;
  color: var(--text-sub);
  margin-right: 4px;
  font-weight: 600;
}

/* Management List Styles */
.manage-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--line-soft);
  background: var(--surface);
  cursor: pointer;
  transition: box-shadow 0.18s ease, background 0.15s ease;
  flex: 1 1 300px; /* Allow wrapping */
  max-width: 100%;
}

.list-row:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.drag-handle {
  color: var(--text-sub);
  opacity: 0.35;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  cursor: grab;
  padding: 4px;
}

.drag-handle:active {
  cursor: grabbing;
}

.seq-num {
  font-size: 11px;
  color: var(--text-sub);
  opacity: 0.4;
  width: 18px;
  text-align: right;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.card-info {
  min-width: 0;
  flex: 1;
}

.display-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-tag {
  flex-shrink: 0;
}

.sortable-ghost {
  opacity: 0.3;
}

.sortable-chosen {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 639px) {
  /* Toolbar: single row, hide column selector */
  .toolbar-container {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
  }

  .toolbar-month {
    flex: 1;
    min-width: 0;
    position: relative;
  }

  .toolbar-right {
    flex-wrap: nowrap;
  }

  .month-picker-wrapper {
    margin: 0 4px;
  }

  /* Hide grid column selector on mobile (list view instead) */
  .grid-selector-btn {
    display: none;
  }

  /* ── Card grid → iOS-style grouped list ── */
  .card-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--line-soft);
    border-radius: 12px;
    overflow: hidden;
  }

  .grid-item {
    height: auto;
    display: block;
  }

  /* Each card becomes a horizontal list row */
  .record-card {
    flex-direction: row;
    align-items: center;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid var(--line-soft);
    padding: 10px 12px;
    gap: 10px;
    cursor: default;
  }

  .record-card:hover {
    border: none;
    border-bottom: 1px solid var(--line-soft);
    box-shadow: none;
  }

  .card-liability:hover {
    border: none;
    border-bottom: 1px solid var(--line-soft);
  }

  /* Last item (add card) has no bottom border */
  .grid-item:last-child .record-card {
    border-bottom: none;
  }

  /* Account info: shrinkable, bounded */
  .card-header {
    flex: 1 1 auto;
    min-width: 100px;
    max-width: 55%;
  }

  /* Amount input: takes remaining space, at least 150px */
  .card-body {
    flex: 1 1 150px;
    min-width: 150px;
  }

  .seq-num {
    display: none;
  }

  .bank-icon {
    width: 22px;
    height: 22px;
    border-radius: 4px;
  }

  /* Hide edit button on mobile */
  .header-action {
    display: none;
  }

  /* Add card: compact horizontal row */
  .add-card {
    border: none;
    border-radius: 0;
    flex-direction: row;
    justify-content: center;
    padding: 10px 12px;
    gap: 8px;
    min-height: 44px;
    background-color: transparent;
  }

  .add-card:hover {
    border: none;
    transform: none;
    box-shadow: none;
    background-color: rgba(0, 0, 0, 0.02);
  }

  .add-icon-wrapper {
    width: 24px;
    height: 24px;
  }

  .add-text {
    font-size: 13px;
  }

  .section-container {
    margin-bottom: 20px;
  }
}

.edit-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Grid Layout for Cards */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* Default to single column for mobile */
  gap: 16px; /* Increased gap to prevent visual overlapping */
}

@media (min-width: 640px) {
  .card-grid {
    /* Use CSS variable linked to user selection, default to 4 if not set */
    grid-template-columns: repeat(var(--cols, 4), 1fr);
    gap: 16px;
  }
}

.grid-item {
  min-width: 0; /* Prevent overflow in grid items */
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.liability-radio.n-radio-button--checked) {
  --n-button-color-active: transparent;
  --n-button-text-color-active: #e11d48;
  --n-button-border-color-active: #fda4af;
  --n-button-box-shadow-focus: 0 0 0 2px rgba(253, 164, 175, 0.3);
  
  background-color: transparent !important;
  color: #e11d48 !important;
  border-color: #fda4af !important;
  box-shadow: 0 0 0 1px #fda4af !important;
  z-index: 1;
}

:deep(.liability-radio.n-radio-button--checked:hover) {
  background-color: rgba(255, 228, 230, 0.3) !important;
  border-color: #fda4af !important;
  box-shadow: 0 0 0 1px #fda4af !important;
}

:deep(.liability-radio.n-radio-button--focus) {
  box-shadow: 0 0 0 1px #fda4af, 0 0 0 2px rgba(253, 164, 175, 0.3) !important;
  z-index: 1;
}

/* Add Account Card Styles */
.add-card {
  height: 100%;
  /* No fixed min-height, let grid stretch it */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1.5px dashed var(--line-soft);
  border-radius: 12px;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-sub);
  gap: 8px;
}

.add-card:hover {
  border-color: var(--primary);
  color: var(--primary);
  background-color: color-mix(in srgb, var(--primary) 4%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.add-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: color-mix(in srgb, var(--surface) 50%, var(--line-soft));
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: inherit;
}

.add-card:hover .add-icon-wrapper {
  background-color: var(--primary);
  color: #fff;
}

.add-text {
  font-size: 13px;

  font-weight: 600;
  transition: color 0.2s ease;
}

/* Modal Form Styles */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px 0;
}


.form-row {
  display: flex;
  align-items: center;
}

.form-label {
  width: 60px;
  padding-right: 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-main);
  text-align: right;
  flex-shrink: 0;
}

.form-control {
  flex: 1;
  min-width: 0;
}

.group-control {
  display: flex;
  gap: 12px;
}

.group-control :deep(.n-radio-group) {
  flex: 1;
  display: flex;
}

.group-control :deep(.n-radio-button) {
  flex: 1; 
  text-align: center;
}

.currency-select {
  width: 110px;
}
</style>
