<script setup lang="ts">
/**
 * AccountFormDialog — 新增/編輯帳戶 Dialog（統一元件）
 *
 * Props:
 *   visible   - Dialog 顯示狀態 (v-model)
 *   mode      - "add" | "edit"
 *   account   - 編輯模式下的帳戶資料（add 模式不需要）
 *   saving    - 是否儲存中
 *
 * Emits:
 *   update:visible - Dialog 關閉
 *   save           - 使用者按下儲存 (form 資料)
 */
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Button from "primevue/button";
import type { Account, AccountType, Currency } from "../../types";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    mode: "add" | "edit";
    account?: Partial<Account> | null;
    saving?: boolean;
  }>(),
  {
    saving: false,
  }
);

const emit = defineEmits<{
  "update:visible": [v: boolean];
  save: [form: AccountFormData];
}>();

export interface AccountFormData {
  name: string;
  type: AccountType;
  currency: Currency;
  category: string;
  alias?: string;
}

const typeOptions = [
  { label: "資產", value: "asset" as AccountType },
  { label: "負債", value: "liability" as AccountType },
];

const currencyOptions = [
  { label: "TWD", value: "TWD" as Currency },
  { label: "USD", value: "USD" as Currency },
  { label: "JPY", value: "JPY" as Currency },
];

const form = ref<AccountFormData>({
  name: "",
  type: "asset",
  currency: "TWD",
  category: "",
  alias: "",
});

// 當 Dialog 開啟時，根據 mode 初始化表單
watch(
  () => props.visible,
  (open) => {
    if (open) {
      if (props.mode === "edit" && props.account) {
        form.value = {
          name: props.account.name || "",
          type: (props.account.type as AccountType) || "asset",
          currency: (props.account.currency as Currency) || "TWD",
          category: props.account.category || "",
          alias: props.account.alias || "",
        };
      } else {
        form.value = {
          name: "",
          type: "asset",
          currency: "TWD",
          category: "",
          alias: "",
        };
      }
    }
  }
);

function onSave() {
  emit("save", { ...form.value });
}

function onCancel() {
  emit("update:visible", false);
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="mode === 'add' ? '新增帳戶' : '編輯帳戶'"
    modal
    :draggable="false"
    style="width: min(400px, 92vw)"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-3.5 py-2">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--text-sub)]">帳戶名稱 *</label>
        <InputText v-model="form.name" placeholder="例：國泰主帳" fluid />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--text-sub)]">別名</label>
        <InputText v-model="form.alias" placeholder="選填" fluid />
      </div>

      <div v-if="mode === 'add'" class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--text-sub)]">類型</label>
        <Select
          v-model="form.type"
          :options="typeOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--text-sub)]">幣別</label>
        <Select
          v-model="form.currency"
          :options="currencyOptions"
          optionLabel="label"
          optionValue="value"
          fluid
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold text-[var(--text-sub)]">分類</label>
        <InputText v-model="form.category" placeholder="例：生活費、投資" fluid />
      </div>
    </div>

    <template #footer>
      <Button label="取消" text severity="secondary" @click="onCancel" />
      <Button
        :label="mode === 'add' ? '新增' : '儲存'"
        :loading="saving"
        @click="onSave"
      />
    </template>
  </Dialog>
</template>
