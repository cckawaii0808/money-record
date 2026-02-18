<script setup lang="ts">
import { computed, h, type VNodeChild } from "vue";
import type { SelectOption, SelectRenderLabel, SelectRenderTag } from "naive-ui";
import {
  NSelect,
  NTag,
  NText
} from "naive-ui";
import { resolveBankIcon } from "../utils/bankIcons";
import { useAssetManager } from "../composables/useAssetManager";

const {
  selectedMonth,
  monthOptions,
  selectedAccountIds,
  accountOptions,
  selectAllAccounts,
  selectedNetTwd,
  formatCurrency,
  accounts
} = useAssetManager();

const netTwdLabel = computed(() => formatCurrency(selectedNetTwd.value, "TWD"));

const isAllSelected = computed(() => selectedAccountIds.value.length === accounts.value.length);

function toggleAllAccounts(): void {
  if (isAllSelected.value) {
    selectedAccountIds.value = [];
  } else {
    selectAllAccounts();
  }
}

const renderLabel: SelectRenderLabel = (option): VNodeChild => {
  const iconUrl = (option as SelectOption & { iconUrl?: string }).iconUrl;
  return h(
    "div",
    { style: "display: flex; align-items: center; gap: 8px; padding: 4px 0" },
    [
      iconUrl
        ? h("img", {
            src: iconUrl,
            alt: "",
            style: "width: 20px; height: 20px; border-radius: 5px; object-fit: cover; border: 1px solid var(--line-soft)"
          })
        : null,
      h("span", { style: "font-weight: 600" }, String(option.label))
    ]
  );
};

const renderTag: SelectRenderTag = ({ option, handleClose }): VNodeChild => {
  return h(
    NTag,
    {
      closable: true,
      onClose: handleClose,
      size: "small",
      bordered: false,
      round: true
    },
    { default: () => String(option.label) }
  );
};
</script>

<template>
  <div class="filters-panel">
    <div class="filters-row">
      <div class="filter-group">
        <NText depth="3" class="filter-label">月份</NText>
        <NSelect
          v-model:value="selectedMonth"
          :options="monthOptions"
          size="medium"
          class="month-select"
        />
      </div>

      <div class="filter-group filter-accounts">
        <div class="filter-header">
          <NText depth="3" class="filter-label">帳戶</NText>
          <NText
            depth="3"
            class="select-all-link"
            @click="toggleAllAccounts"
          >
            {{ isAllSelected ? "取消全選" : "全選" }}
          </NText>
        </div>
        <NSelect
          v-model:value="selectedAccountIds"
          :options="accountOptions"
          :render-label="renderLabel"
          :render-tag="renderTag"
          multiple
          filterable
          size="medium"
          max-tag-count="responsive"
          class="account-select"
        />
      </div>
    </div>

    <NText depth="3" class="meta-item">
      選取淨值：<strong>{{ netTwdLabel }}</strong>
    </NText>
  </div>
</template>

<style scoped>
.filters-panel {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: var(--surface);
}

.filters-row {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-accounts {
  flex: 1;
  min-width: 200px;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-all-link {
  font-size: 12px;
  cursor: pointer;
  color: var(--primary);
  user-select: none;
}

.select-all-link:hover {
  text-decoration: underline;
}

.filter-label {
  font-size: 12px;
  font-weight: 700;
}

.month-select {
  width: 140px;
}

.account-select {
  width: 100%;
}

.meta-item {
  display: block;
  margin-top: 12px;
  font-size: 13px;
}
</style>
