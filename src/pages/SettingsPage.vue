<script setup lang="ts">
/**
 * SettingsPage — 設定（PrimeVue + Tailwind）
 */
import { ref, computed } from "vue";
import { useIsDesktop } from "../composables/useIsDesktop";
const { isDesktop } = useIsDesktop();
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Tag from "primevue/tag";
import Divider from "primevue/divider";
import ConfirmDialog from "primevue/confirmdialog";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useAssetManagerStore } from "../stores";
import type { Account, AccountType, Currency } from "../types";

const toast   = useToast();
const confirm = useConfirm();
const { isLoading, accounts, newAccount, addAccount, updateAccount, deleteAccount, accountDisplayName } = useAssetManagerStore();

const assetAccounts = computed(() => accounts.value.filter(a => a.type === "asset"));
const liabAccounts  = computed(() => accounts.value.filter(a => a.type === "liability"));

const typeOptions     = [{ label: "資產", value: "asset" }, { label: "負債", value: "liability" }];
const currencyOptions = [{ label: "TWD", value: "TWD" }, { label: "USD", value: "USD" }, { label: "JPY", value: "JPY" }, { label: "EUR", value: "EUR" }];

// --- 新增 ---
const addVisible = ref(false);
const addForm    = ref({ name: "", type: "asset" as AccountType, currency: "TWD" as Currency, category: "", alias: "" });
const isSavingAdd = ref(false);

function openAdd() {
  addForm.value = { name: "", type: "asset", currency: "TWD", category: "", alias: "" };
  addVisible.value = true;
}

async function submitAdd() {
  if (!addForm.value.name.trim()) { toast.add({ severity: "warn", summary: "請填寫帳戶名稱", life: 2000 }); return; }
  isSavingAdd.value = true;
  try {
    Object.assign(newAccount.value, addForm.value);
    await addAccount();
    toast.add({ severity: "success", summary: "帳戶新增成功", life: 2000 });
    addVisible.value = false;
  } catch { toast.add({ severity: "error", summary: "新增失敗", life: 3000 }); }
  finally { isSavingAdd.value = false; }
}

// --- 編輯 ---
const editVisible  = ref(false);
const editForm     = ref<Partial<Account>>({});
const isSavingEdit = ref(false);

function openEdit(acc: Account) { editForm.value = { ...acc }; editVisible.value = true; }

async function submitEdit() {
  if (!editForm.value.name?.trim()) { toast.add({ severity: "warn", summary: "請填寫帳戶名稱", life: 2000 }); return; }
  isSavingEdit.value = true;
  try {
    await updateAccount(editForm.value as Account);
    toast.add({ severity: "success", summary: "更新成功", life: 2000 });
    editVisible.value = false;
  } catch { toast.add({ severity: "error", summary: "更新失敗", life: 3000 }); }
  finally { isSavingEdit.value = false; }
}

// --- 刪除 ---
function confirmDelete(acc: Account) {
  confirm.require({
    message: `確定要刪除「${accountDisplayName(acc)}」？`,
    header: "刪除帳戶", icon: "pi pi-exclamation-triangle",
    acceptLabel: "確定刪除", rejectLabel: "取消", acceptClass: "p-button-danger",
    accept: async () => {
      try { await deleteAccount(acc.id); toast.add({ severity: "success", summary: "已刪除", life: 2000 }); }
      catch { toast.add({ severity: "error", summary: "刪除失敗", life: 3000 }); }
    }
  });
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 pt-6 pb-24">
    <ConfirmDialog />

    <!-- 頁首：桌面版 Teleport 到 App.vue header，手機版維持原位 -->
    <Teleport defer to="#app-header-slot" :disabled="!isDesktop">
      <div :class="isDesktop ? 'flex items-center justify-between w-full' : 'flex items-center justify-between mb-6'">
        <h1 class="text-2xl font-extrabold text-[var(--text-main)] m-0">設定</h1>
        <Button label="新增帳戶" icon="pi pi-plus" size="small" @click="openAdd" />
      </div>
    </Teleport>

    <!-- 資產帳戶 -->
    <section>
      <div class="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider mb-2">資產帳戶</div>
      <div v-if="isLoading" class="flex flex-col gap-2">
        <div v-for="i in 3" :key="i" class="h-16 rounded-xl bg-[var(--line-soft)] animate-pulse" />
      </div>
      <div v-else-if="!assetAccounts.length" class="text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl">
        尚無資產帳戶，點擊「新增帳戶」開始
      </div>
      <div v-else class="flex flex-col gap-2">
        <div v-for="acc in assetAccounts" :key="acc.id"
             class="flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl px-3.5 py-3 shadow-sm">
          <div class="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm shrink-0"
               :style="{ background: acc.color ?? '#0f766e' }">{{ acc.name.charAt(0) }}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-[var(--text-main)] truncate">{{ accountDisplayName(acc) }}</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <Tag value="資產" severity="success" class="text-[10px] py-0 px-1.5" />
              <span class="text-[11px] text-[var(--text-sub)]">{{ acc.currency }}</span>
              <span v-if="acc.category" class="text-[11px] text-[var(--text-sub)]">· {{ acc.category }}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <Button icon="pi pi-pencil" rounded text severity="secondary" size="small" @click="openEdit(acc)" />
            <Button icon="pi pi-trash" rounded text severity="danger" size="small" @click="confirmDelete(acc)" />
          </div>
        </div>
      </div>
    </section>

    <Divider />

    <!-- 負債帳戶 -->
    <section>
      <div class="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider mb-2">負債帳戶</div>
      <div v-if="!isLoading && !liabAccounts.length" class="text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl">
        尚無負債帳戶
      </div>
      <div v-else class="flex flex-col gap-2">
        <div v-for="acc in liabAccounts" :key="acc.id"
             class="flex items-center gap-3 bg-[var(--surface)] border border-[var(--line-soft)] rounded-xl px-3.5 py-3 shadow-sm">
          <div class="w-9 h-9 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm shrink-0"
               :style="{ background: acc.color ?? '#dc2626' }">{{ acc.name.charAt(0) }}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-[var(--text-main)] truncate">{{ accountDisplayName(acc) }}</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <Tag value="負債" severity="warn" class="text-[10px] py-0 px-1.5" />
              <span class="text-[11px] text-[var(--text-sub)]">{{ acc.currency }}</span>
              <span v-if="acc.category" class="text-[11px] text-[var(--text-sub)]">· {{ acc.category }}</span>
            </div>
          </div>
          <div class="flex gap-1">
            <Button icon="pi pi-pencil" rounded text severity="secondary" size="small" @click="openEdit(acc)" />
            <Button icon="pi pi-trash" rounded text severity="danger" size="small" @click="confirmDelete(acc)" />
          </div>
        </div>
      </div>
    </section>

    <!-- 新增 Dialog -->
    <Dialog v-model:visible="addVisible" header="新增帳戶" modal :draggable="false" style="width:min(400px,92vw)">
      <div class="flex flex-col gap-3.5 py-2">
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">帳戶名稱 *</label><InputText v-model="addForm.name" placeholder="例：國泰主帳" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">別名</label><InputText v-model="addForm.alias" placeholder="選填" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">類型</label><Select v-model="addForm.type" :options="typeOptions" optionLabel="label" optionValue="value" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">幣別</label><Select v-model="addForm.currency" :options="currencyOptions" optionLabel="label" optionValue="value" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">分類</label><InputText v-model="addForm.category" placeholder="例：生活費、投資" fluid /></div>
      </div>
      <template #footer>
        <Button label="取消" text severity="secondary" @click="addVisible = false" />
        <Button label="新增" :loading="isSavingAdd" @click="submitAdd" />
      </template>
    </Dialog>

    <!-- 編輯 Dialog -->
    <Dialog v-model:visible="editVisible" header="編輯帳戶" modal :draggable="false" style="width:min(400px,92vw)">
      <div class="flex flex-col gap-3.5 py-2" v-if="editForm.id">
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">帳戶名稱 *</label><InputText v-model="editForm.name" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">別名</label><InputText v-model="editForm.alias" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">幣別</label><Select v-model="editForm.currency" :options="currencyOptions" optionLabel="label" optionValue="value" fluid /></div>
        <div class="flex flex-col gap-1"><label class="text-xs font-semibold text-[var(--text-sub)]">分類</label><InputText v-model="editForm.category" fluid /></div>
      </div>
      <template #footer>
        <Button label="取消" text severity="secondary" @click="editVisible = false" />
        <Button label="儲存" :loading="isSavingEdit" @click="submitEdit" />
      </template>
    </Dialog>
  </div>
</template>
