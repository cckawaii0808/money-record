<script setup lang="ts">
/**
 * RecordsPage — 每月記錄（PrimeVue + Tailwind）
 * 加入分類區塊、電腦版排版重構、Enter鍵儲存及輸入框調整
 */
import { computed, ref } from "vue";
import { useIsDesktop } from "../composables/useIsDesktop";
const { isDesktop } = useIsDesktop();
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import Skeleton from "primevue/skeleton";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import ConfirmDialog from "primevue/confirmdialog";
import Divider from "primevue/divider";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useAssetManagerStore } from "../stores";
import type { MonthlyRecord, Account, AccountType, Currency } from "../types";

const toast = useToast();
const confirm = useConfirm();
const assetManager = useAssetManagerStore();
const { isLoading, accounts, selectedMonth, months, newAccount } =
  storeToRefs(assetManager);

const {
  amountAtMonth,
  toTwd,
  bulkUpsertMonthlyRecords,
  formatCurrency,
  accountDisplayName,
  addAccount,
  updateAccount,
  deleteAccount,
} = assetManager;

// --- 月份摘要 ---
const totalAssetTwd = computed(() =>
  accounts.value
    .filter((a) => a.type === "asset")
    .reduce(
      (s, a) => s + toTwd(amountAtMonth(a.id, selectedMonth.value), a.currency),
      0,
    ),
);
const totalLiabTwd = computed(() =>
  accounts.value
    .filter((a) => a.type === "liability")
    .reduce(
      (s, a) => s + toTwd(amountAtMonth(a.id, selectedMonth.value), a.currency),
      0,
    ),
);
const netWorthTwd = computed(() => totalAssetTwd.value - totalLiabTwd.value);

const assetAccounts = computed(() =>
  accounts.value.filter((a) => a.type === "asset"),
);
const liabAccounts = computed(() =>
  accounts.value.filter((a) => a.type === "liability"),
);

// --- 分類分組 ---
function groupByCategory(accountsArray: Account[]) {
  const groups: Record<string, Account[]> = {};
  for (const acc of accountsArray) {
    const cat = acc.category || "未分類";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(acc);
  }
  return groups;
}

const assetCategories = computed(() => groupByCategory(assetAccounts.value));
const liabCategories = computed(() => groupByCategory(liabAccounts.value));

const isFirst = computed(
  () => months.value.length > 0 && selectedMonth.value === months.value[0],
);
const isLast = computed(
  () =>
    months.value.length > 0 &&
    selectedMonth.value === months.value[months.value.length - 1],
);

function goToPrevMonth() {
  const idx = months.value.indexOf(selectedMonth.value);
  if (idx > 0) selectedMonth.value = months.value[idx - 1];
}

function goToNextMonth() {
  const idx = months.value.indexOf(selectedMonth.value);
  if (idx < months.value.length - 1)
    selectedMonth.value = months.value[idx + 1];
}

// --- 月差 ---
function prevMonthStr() {
  const [y, m] = selectedMonth.value.split("-").map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}
function deltaFor(account: Account) {
  return (
    amountAtMonth(account.id, selectedMonth.value) -
    amountAtMonth(account.id, prevMonthStr())
  );
}

// --- 編輯 ---
const editVisible = ref(false);
const editAccount = ref<Account | null>(null);
const editValue = ref<number | null>(null);
const isSaving = ref(false);

function openEdit(account: Account) {
  editAccount.value = account;
  editValue.value = amountAtMonth(account.id, selectedMonth.value);
  editVisible.value = true;
}

async function save() {
  if (!editAccount.value || editValue.value === null) return;
  isSaving.value = true;
  try {
    await bulkUpsertMonthlyRecords(selectedMonth.value, [
      { accountId: editAccount.value.id, amount: editValue.value },
    ]);
    toast.add({ severity: "success", summary: "儲存成功", life: 2000 });
    editVisible.value = false;
  } catch {
    toast.add({
      severity: "error",
      summary: "儲存失敗，請稍後再試",
      life: 3000,
    });
  } finally {
    isSaving.value = false;
  }
}

function onInputEnter() {
  save();
}

// --- 帳戶管理 (來自舊 SettingsPage) ---
const typeOptions = [
  { label: "資產", value: "asset" },
  { label: "負債", value: "liability" },
];
const currencyOptions = [
  { label: "TWD", value: "TWD" },
  { label: "USD", value: "USD" },
  { label: "JPY", value: "JPY" },
  { label: "EUR", value: "EUR" },
];

// 新增帳戶
const addVisible = ref(false);
const addForm = ref({
  name: "",
  type: "asset" as AccountType,
  currency: "TWD" as Currency,
  category: "",
  alias: "",
});
const isSavingAdd = ref(false);

function openAddAccount() {
  addForm.value = {
    name: "",
    type: "asset",
    currency: "TWD",
    category: "",
    alias: "",
  };
  addVisible.value = true;
}

async function submitAdd() {
  if (!addForm.value.name.trim()) {
    toast.add({ severity: "warn", summary: "請填寫帳戶名稱", life: 2000 });
    return;
  }
  isSavingAdd.value = true;
  try {
    Object.assign(newAccount.value, addForm.value);
    await addAccount();
    toast.add({ severity: "success", summary: "帳戶新增成功", life: 2000 });
    addVisible.value = false;
  } catch {
    toast.add({ severity: "error", summary: "新增失敗", life: 3000 });
  } finally {
    isSavingAdd.value = false;
  }
}

// 編輯帳戶
const editAccVisible = ref(false);
const editAccForm = ref<Partial<Account>>({});
const isSavingEditAcc = ref(false);

function openEditAcc(acc: Account, event: Event) {
  event.stopPropagation();
  editAccForm.value = { ...acc };
  editAccVisible.value = true;
}

async function submitEditAcc() {
  if (!editAccForm.value.name?.trim()) {
    toast.add({ severity: "warn", summary: "請填寫帳戶名稱", life: 2000 });
    return;
  }
  isSavingEditAcc.value = true;
  try {
    await updateAccount(editAccForm.value as Account);
    toast.add({ severity: "success", summary: "更新成功", life: 2000 });
    editAccVisible.value = false;
  } catch {
    toast.add({ severity: "error", summary: "更新失敗", life: 3000 });
  } finally {
    isSavingEditAcc.value = false;
  }
}

// 刪除帳戶
function confirmDeleteAcc(acc: Account, event: Event) {
  event.stopPropagation();
  confirm.require({
    message: `確定要刪除「${accountDisplayName(acc)}」整個帳戶與其所有歷史紀錄嗎？`,
    header: "刪除帳戶",
    icon: "pi pi-exclamation-triangle",
    acceptLabel: "確定刪除",
    rejectLabel: "取消",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await deleteAccount(acc.id);
        toast.add({ severity: "success", summary: "已刪除", life: 2000 });
      } catch {
        toast.add({ severity: "error", summary: "刪除失敗", life: 3000 });
      }
    },
  });
}

const fmtTwd = (v: number) =>
  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(v);
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-24 relative">
    <ConfirmDialog />

    <!-- 月份選擇器：桌面版 Teleport 到 App.vue header，手機版 sticky -->
    <Teleport defer to="#app-header-slot" :disabled="!isDesktop">
      <div
        :class="
          isDesktop
            ? 'grid grid-cols-3 items-center w-full'
            : 'block text-center mb-6 sticky top-0 z-[50] bg-[var(--app-bg)]/95 backdrop-blur-md py-3 -mx-4 px-4'
        "
      >
        <h1
          v-if="isDesktop"
          class="text-2xl font-bold text-[var(--text-main)] m-0"
        >
          每月記錄
        </h1>
        <div
          :class="
            isDesktop ? 'flex justify-center' : 'w-full flex justify-center'
          "
        >
          <div
            class="inline-flex items-center bg-[var(--surface)] px-2 py-1.5 rounded-2xl shadow-sm border border-[var(--line-soft)]"
          >
            <Button
              icon="pi pi-chevron-left"
              text
              rounded
              @click="goToPrevMonth"
              :disabled="isFirst"
              class="text-[var(--text-sub)] !p-2 h-10 w-10"
            />
            <span
              class="w-36 text-center text-[15px] font-bold text-[var(--text-main)] tabular-nums"
            >
              {{ selectedMonth }}
            </span>
            <Button
              icon="pi pi-chevron-right"
              text
              rounded
              @click="goToNextMonth"
              :disabled="isLast"
              class="text-[var(--text-sub)] !p-2 h-10 w-10"
            />
          </div>
        </div>
        <div v-if="isDesktop" class="flex justify-end gap-2 pr-2">
          <Button
            label="新增帳戶"
            icon="pi pi-plus"
            size="small"
            @click="openAddAccount"
          />
        </div>
      </div>
    </Teleport>

    <!-- 在手機版顯示新增帳戶按鈕 -->
    <div v-if="!isDesktop" class="flex justify-end mb-4 px-1">
      <Button
        label="新增帳戶"
        icon="pi pi-plus"
        size="small"
        @click="openAddAccount"
      />
    </div>

    <!-- Apollo KPI 摘要區 (分離的三張卡片) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Asset KPI -->
      <div class="apollo-card flex flex-col justify-between h-[130px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-bold text-[var(--text-main)]"
              >總資產</span
            >
            <span
              class="text-[26px] font-black tabular-nums tracking-tight text-[var(--positive)]"
              >{{ fmtTwd(totalAssetTwd) }}</span
            >
          </div>
          <div
            class="w-10 h-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)]"
          >
            <i class="pi pi-building text-lg"></i>
          </div>
        </div>
      </div>

      <!-- Liability KPI -->
      <div class="apollo-card flex flex-col justify-between h-[130px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-bold text-[var(--text-main)]"
              >總負債</span
            >
            <span
              class="text-[26px] font-black tabular-nums tracking-tight text-[var(--negative)]"
              >{{ fmtTwd(totalLiabTwd) }}</span
            >
          </div>
          <div
            class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500"
          >
            <i class="pi pi-credit-card text-lg"></i>
          </div>
        </div>
      </div>

      <!-- Net Worth KPI -->
      <div class="apollo-card flex flex-col justify-between h-[130px]">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1.5">
            <span class="text-[13px] font-bold text-[var(--text-main)]"
              >本月淨值</span
            >
            <span
              class="text-[26px] font-black tabular-nums tracking-tight"
              :class="
                netWorthTwd >= 0
                  ? 'text-[var(--positive)]'
                  : 'text-[var(--negative)]'
              "
            >
              {{ fmtTwd(netWorthTwd) }}
            </span>
          </div>
          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"
          >
            <i class="pi pi-wallet text-lg"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 區塊排版 (電腦版雙欄) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 資產區塊 -->
      <section>
        <div class="flex items-center gap-2 mb-4 px-1">
          <div class="w-1.5 h-5 bg-green-500 rounded-full"></div>
          <h2 class="text-lg font-bold text-[var(--text-main)] m-0">資產</h2>
        </div>

        <div v-if="isLoading" class="flex flex-col gap-2">
          <Skeleton v-for="i in 4" :key="i" height="64px" borderRadius="12px" />
        </div>
        <div
          v-else-if="!assetAccounts.length"
          class="text-center text-sm text-[var(--text-sub)] py-6 border border-dashed border-[var(--line-soft)] rounded-xl"
        >
          尚無資產帳戶
        </div>
        <div v-else class="flex flex-col gap-6">
          <!-- 照分類顯示 -->
          <div v-for="(accounts, catName) in assetCategories" :key="catName">
            <h3
              class="flex items-center gap-2 text-xs font-bold text-[var(--text-sub)] mb-2 px-1"
            >
              {{ catName }}
              <Divider type="dashed" class="!my-0 !flex-1" />
            </h3>
            <div class="flex flex-col gap-3">
              <div
                v-for="acc in accounts"
                :key="acc.id"
                class="apollo-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:-translate-y-[1px] hover:border-[var(--primary)] transition-all"
                @click="openEdit(acc)"
                role="button"
                tabindex="0"
                @keydown.enter="openEdit(acc)"
              >
                <!-- 卡片左側 (名字與圖示) -->
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-sm"
                    :style="{ background: acc.color ?? '#0f766e' }"
                  >
                    {{ acc.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span
                      class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate"
                    >
                      {{ accountDisplayName(acc) }}
                    </span>
                    <span
                      class="text-[11px] sm:text-[13px] text-[var(--text-sub)] font-semibold mt-0.5"
                    >
                      {{ acc.currency }}
                    </span>
                  </div>
                </div>

                <!-- 卡片右側 (金額與漲跌 + 動作按鈕) -->
                <div class="flex items-center justify-end gap-3 shrink-0 ml-2">
                  <div class="flex flex-col sm:items-end">
                    <div
                      class="text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--text-main)] text-right"
                    >
                      {{
                        formatCurrency(
                          amountAtMonth(acc.id, selectedMonth),
                          acc.currency,
                        )
                      }}
                    </div>
                    <div class="flex items-center justify-end w-16 sm:w-24">
                      <span
                        v-if="deltaFor(acc) !== 0"
                        class="text-[12px] sm:text-[13px] font-bold tabular-nums"
                        :class="
                          deltaFor(acc) > 0
                            ? 'text-[var(--positive)]'
                            : 'text-[var(--negative)]'
                        "
                      >
                        {{ deltaFor(acc) > 0 ? "+" : ""
                        }}{{ formatCurrency(deltaFor(acc), acc.currency) }}
                      </span>
                      <span
                        v-else
                        class="text-[12px] sm:text-[13px] font-bold text-[var(--text-muted)]"
                        >-</span
                      >
                    </div>
                  </div>
                  <!-- 設定動作按鈕 (防止冒泡觸發卡片點擊) -->
                  <div
                    class="flex gap-1 shrink-0 bg-gray-50/50 sm:bg-transparent rounded-lg p-1 sm:p-0"
                  >
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      text
                      severity="secondary"
                      size="small"
                      @click.stop="openEditAcc(acc, $event)"
                    />
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      severity="danger"
                      size="small"
                      @click.stop="confirmDeleteAcc(acc, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 負債區塊 -->
      <section v-if="!isLoading && liabAccounts.length">
        <div class="flex items-center gap-2 mb-4 px-1">
          <div class="w-1.5 h-5 bg-red-500 rounded-full"></div>
          <h2 class="text-lg font-bold text-[var(--text-main)] m-0">負債</h2>
        </div>

        <div class="flex flex-col gap-6">
          <!-- 照分類顯示 -->
          <div v-for="(accounts, catName) in liabCategories" :key="catName">
            <h3
              class="flex items-center gap-2 text-xs font-bold text-[var(--text-sub)] mb-2 px-1"
            >
              {{ catName }}
              <Divider type="dashed" class="!my-0 !flex-1" />
            </h3>
            <div class="flex flex-col gap-3">
              <div
                v-for="acc in accounts"
                :key="acc.id"
                class="apollo-card !p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:-translate-y-[1px] hover:border-[var(--negative)] transition-all"
                @click="openEdit(acc)"
                role="button"
                tabindex="0"
                @keydown.enter="openEdit(acc)"
              >
                <!-- 卡片左側 -->
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[16px] font-black shrink-0 shadow-sm"
                    :style="{ background: acc.color ?? '#dc2626' }"
                  >
                    {{ acc.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span
                      class="text-[14px] sm:text-[15px] font-bold text-[var(--text-main)] truncate"
                    >
                      {{ accountDisplayName(acc) }}
                    </span>
                    <span
                      class="text-[11px] sm:text-[13px] text-[var(--text-sub)] font-semibold mt-0.5"
                    >
                      {{ acc.currency }}
                    </span>
                  </div>
                </div>

                <!-- 卡片右側 -->
                <div class="flex items-center justify-end gap-3 shrink-0 ml-2">
                  <div class="flex flex-col sm:items-end">
                    <div
                      class="text-[15px] sm:text-[18px] font-black tabular-nums text-[var(--negative)] text-right"
                    >
                      {{
                        formatCurrency(
                          amountAtMonth(acc.id, selectedMonth),
                          acc.currency,
                        )
                      }}
                    </div>
                    <div class="flex items-center justify-end w-16 sm:w-24">
                      <span
                        v-if="deltaFor(acc) !== 0"
                        class="text-[12px] sm:text-[13px] font-bold tabular-nums"
                        :class="
                          deltaFor(acc) > 0
                            ? 'text-[var(--negative)]'
                            : 'text-[var(--positive)]'
                        "
                      >
                        {{ deltaFor(acc) > 0 ? "+" : ""
                        }}{{ formatCurrency(deltaFor(acc), acc.currency) }}
                      </span>
                      <span
                        v-else
                        class="text-[12px] sm:text-[13px] font-bold text-[var(--text-muted)]"
                        >-</span
                      >
                    </div>
                  </div>
                  <!-- 設定動作按鈕 (防止冒泡觸發卡片點擊) -->
                  <div
                    class="flex gap-1 shrink-0 bg-red-50/50 sm:bg-transparent rounded-lg p-1 sm:p-0"
                  >
                    <Button
                      icon="pi pi-pencil"
                      rounded
                      text
                      severity="secondary"
                      size="small"
                      @click.stop="openEditAcc(acc, $event)"
                    />
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      severity="danger"
                      size="small"
                      @click.stop="confirmDeleteAcc(acc, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 新增帳戶 Dialog -->
    <Dialog
      v-model:visible="addVisible"
      header="新增帳戶"
      modal
      :draggable="false"
      style="width: min(400px, 92vw)"
    >
      <div class="flex flex-col gap-3.5 py-2">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >帳戶名稱 *</label
          ><InputText v-model="addForm.name" placeholder="例：國泰主帳" fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >別名</label
          ><InputText v-model="addForm.alias" placeholder="選填" fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >類型</label
          ><Select
            v-model="addForm.type"
            :options="typeOptions"
            optionLabel="label"
            optionValue="value"
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >幣別</label
          ><Select
            v-model="addForm.currency"
            :options="currencyOptions"
            optionLabel="label"
            optionValue="value"
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >分類</label
          ><InputText
            v-model="addForm.category"
            placeholder="例：生活費、投資"
            fluid
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="取消"
          text
          severity="secondary"
          @click="addVisible = false"
        />
        <Button label="新增" :loading="isSavingAdd" @click="submitAdd" />
      </template>
    </Dialog>

    <!-- 編輯帳戶 Dialog -->
    <Dialog
      v-model:visible="editAccVisible"
      header="編輯帳戶"
      modal
      :draggable="false"
      style="width: min(400px, 92vw)"
    >
      <div class="flex flex-col gap-3.5 py-2" v-if="editAccForm.id">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >帳戶名稱 *</label
          ><InputText v-model="editAccForm.name" fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >別名</label
          ><InputText v-model="editAccForm.alias" fluid />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >幣別</label
          ><Select
            v-model="editAccForm.currency"
            :options="currencyOptions"
            optionLabel="label"
            optionValue="value"
            fluid
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold text-[var(--text-sub)]"
            >分類</label
          ><InputText v-model="editAccForm.category" fluid />
        </div>
      </div>
      <template #footer>
        <Button
          label="取消"
          text
          severity="secondary"
          @click="editAccVisible = false"
        />
        <Button
          label="儲存"
          :loading="isSavingEditAcc"
          @click="submitEditAcc"
        />
      </template>
    </Dialog>

    <!-- 編輯當月金額 Dialog -->
    <Dialog
      v-model:visible="editVisible"
      :header="editAccount ? accountDisplayName(editAccount) : '編輯'"
      modal
      :draggable="false"
      style="width: min(380px, 92vw)"
    >
      <div class="flex flex-col gap-4 py-2" v-if="editAccount">
        <p class="text-xs text-[var(--text-sub)] text-center m-0">
          {{ editAccount.currency }} · {{ selectedMonth }}
        </p>

        <InputNumber
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
          @keydown.enter="onInputEnter"
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
            @click="save"
            class="flex-1"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>
