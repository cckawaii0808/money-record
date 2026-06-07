<script setup lang="ts">
/**
 * AccountManageDialog — 統一管理帳戶 Dialog
 *
 * 提供帳戶的：
 *   - 列表檢視（名稱、類型、幣別、分類）
 *   - 新增（開啟 AccountFormDialog）
 *   - 編輯（開啟 AccountFormDialog）
 *   - 刪除（確認後執行）
 *   - 排序（上移/下移按鈕）
 *
 * Props:
 *   visible - Dialog 顯示狀態 (v-model)
 *
 * Emits:
 *   update:visible - Dialog 關閉
 */
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Tag from "primevue/tag";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useAssetManagerStore } from "../../stores";
import { storeToRefs } from "pinia";
import type { Account } from "../../types";
import AccountFormDialog from "./AccountFormDialog.vue";
import type { AccountFormData } from "./AccountFormDialog.vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [v: boolean];
}>();

const store = useAssetManagerStore();
const { accounts } = storeToRefs(store);
const confirm = useConfirm();
const toast = useToast();

// ── 編輯狀態 ──
const editDialogVisible = ref(false);
const editTarget = ref<Partial<Account> | null>(null);
const isSavingEdit = ref(false);

// ── 新增狀態 ──
const addDialogVisible = ref(false);
const isSavingAdd = ref(false);

// ── 排序 ──
function moveUp(index: number) {
  if (index <= 0) return;
  store.reorderAccount(index, index - 1);
}

function moveDown(index: number) {
  if (index >= accounts.value.length - 1) return;
  store.reorderAccount(index, index + 1);
}

// ── 自動排序 ──
const sortDesc = ref(true);

async function autoSortAccounts() {
  const list = [...accounts.value];
  const isDesc = sortDesc.value;
  
  list.sort((a, b) => {
    // 1. 比較分類名稱
    const catA = a.category || "未分類";
    const catB = b.category || "未分類";
    if (catA !== catB) {
      return catA.localeCompare(catB, "zh-TW");
    }
    // 2. 比較同分類下的絕對值金額
    const amtA = Math.abs(store.amountAtMonth(a.id, store.selectedMonth));
    const amtB = Math.abs(store.amountAtMonth(b.id, store.selectedMonth));
    return isDesc ? amtB - amtA : amtA - amtB;
  });

  try {
    const result = await store.reorderAllAccounts(list);
    if (result.type === "success") {
      toast.add({ severity: "success", summary: `已依金額自動排序 (${isDesc ? '大到小' : '小到大'})`, life: 2000 });
      sortDesc.value = !isDesc; // 切換下一次的排序方向
    } else {
      toast.add({ severity: "error", summary: result.message, life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: "自動排序失敗", life: 3000 });
  }
}

// ── 新增 ──
function openAdd() {
  addDialogVisible.value = true;
}

async function handleAdd(form: AccountFormData) {
  if (!form.name.trim()) {
    toast.add({ severity: "warn", summary: "請填寫帳戶名稱", life: 2000 });
    return;
  }
  isSavingAdd.value = true;
  try {
    store.newAccount = {
      name: form.name,
      category: form.category || "未分類",
      type: form.type,
      currency: form.currency,
    };
    const result = await store.addAccount();
    if (result.type === "success") {
      toast.add({ severity: "success", summary: result.message, life: 2000 });
      addDialogVisible.value = false;
    } else {
      toast.add({ severity: "error", summary: result.message, life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: "新增失敗", life: 3000 });
  } finally {
    isSavingAdd.value = false;
  }
}

// ── 編輯 ──
function openEdit(acc: Account) {
  editTarget.value = { ...acc };
  editDialogVisible.value = true;
}

async function handleEdit(form: AccountFormData) {
  if (!form.name.trim() || !editTarget.value?.id) {
    toast.add({ severity: "warn", summary: "請填寫帳戶名稱", life: 2000 });
    return;
  }
  isSavingEdit.value = true;
  try {
    const result = await store.updateAccountById(editTarget.value.id, {
      name: form.name,
      category: form.category,
      currency: form.currency,
    });
    if (result.type === "success") {
      toast.add({ severity: "success", summary: result.message, life: 2000 });
      editDialogVisible.value = false;
    } else {
      toast.add({ severity: "error", summary: result.message, life: 3000 });
    }
  } catch {
    toast.add({ severity: "error", summary: "更新失敗", life: 3000 });
  } finally {
    isSavingEdit.value = false;
  }
}

// ── 刪除 ──
function confirmDelete(acc: Account) {
  confirm.require({
    message: `確定要刪除「${acc.name}」與其所有歷史紀錄嗎？`,
    header: "刪除帳戶",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "確定刪除",
    rejectLabel: "取消",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        const result = await store.deleteAccount(acc.id);
        if (result.type === "success") {
          toast.add({ severity: "success", summary: result.message, life: 2000 });
        } else {
          toast.add({ severity: "error", summary: result.message, life: 3000 });
        }
      } catch {
        toast.add({ severity: "error", summary: "刪除失敗", life: 3000 });
      }
    },
  });
}

// 計算 Show 用的 typeLabel
function typeLabel(t: string): string {
  return t === "asset" ? "資產" : "負債";
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    header="管理帳戶"
    modal
    :draggable="false"
    :style="{ width: '90vw', maxWidth: '520px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="py-2">
      <!-- 頂部操作按鈕區 -->
      <div class="flex items-center justify-between mb-4">
        <Button
          label="依金額自動排序"
          :icon="sortDesc ? 'pi pi-sort-amount-down' : 'pi pi-sort-amount-up-alt'"
          size="small"
          severity="secondary"
          text
          @click="autoSortAccounts"
        />
        <Button
          label="新增帳戶"
          icon="pi pi-plus"
          size="small"
          @click="openAdd"
        />
      </div>

      <!-- 帳戶列表 -->
      <div v-if="accounts.length === 0" class="text-center py-8 text-sm text-[var(--text-sub)]">
        尚無任何帳戶
      </div>

      <div v-else class="flex flex-col gap-1">
        <div
          v-for="(acc, idx) in accounts"
          :key="acc.id"
          class="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-[var(--app-bg)] transition-colors border-b border-[var(--line-soft)] last:border-b-0"
        >
          <!-- 左側：帳戶資訊 -->
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <!-- 排序按鈕 -->
            <div class="flex flex-col gap-0.5 shrink-0">
              <button
                class="w-5 h-3 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                :disabled="idx === 0"
                @click="moveUp(idx)"
                title="上移"
              >
                <i class="pi pi-chevron-up text-[10px]"></i>
              </button>
              <button
                class="w-5 h-3 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                :disabled="idx === accounts.length - 1"
                @click="moveDown(idx)"
                title="下移"
              >
                <i class="pi pi-chevron-down text-[10px]"></i>
              </button>
            </div>

            <div class="flex flex-col min-w-0 flex-1">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-[14px] font-bold text-[var(--text-main)] truncate">
                  {{ acc.name }}
                </span>
                <Tag
                  :value="acc.currency"
                  severity="secondary"
                  class="!text-[9px] !py-0 !px-1 font-mono shrink-0"
                />
              </div>
              <div class="flex items-center gap-2 mt-0.5">
                <Tag
                  :value="typeLabel(acc.type)"
                  :severity="acc.type === 'asset' ? 'success' : 'warn'"
                  class="!text-[9px] !py-0 !px-1.5"
                />
                <span class="text-[11px] text-[var(--text-sub)] truncate">
                  {{ acc.category || "未分類" }}
                </span>
              </div>
            </div>
          </div>

          <!-- 右側：操作按鈕 -->
          <div class="flex gap-1 shrink-0 ml-2">
            <Button
              icon="pi pi-pencil"
              rounded
              text
              severity="secondary"
              size="small"
              class="!w-8 !h-8 !p-0"
              @click="openEdit(acc)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              text
              severity="danger"
              size="small"
              class="!w-8 !h-8 !p-0"
              @click="confirmDelete(acc)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 子 Dialog：新增帳戶 -->
    <AccountFormDialog
      :visible="addDialogVisible"
      mode="add"
      :saving="isSavingAdd"
      @update:visible="addDialogVisible = $event"
      @save="handleAdd"
    />

    <!-- 子 Dialog：編輯帳戶 -->
    <AccountFormDialog
      :visible="editDialogVisible"
      mode="edit"
      :account="editTarget"
      :saving="isSavingEdit"
      @update:visible="editDialogVisible = $event"
      @save="handleEdit"
    />
  </Dialog>
</template>
