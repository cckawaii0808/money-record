<script setup lang="ts">
import { useIsDesktop } from "../composables/useIsDesktop";
const { isDesktop } = useIsDesktop();
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 pt-6 pb-24 text-center">
    <Teleport defer to="#app-header-slot" :disabled="!isDesktop">
      <div
        :class="
          isDesktop
            ? 'flex items-center justify-between w-full'
            : 'flex items-center justify-between mb-6'
        "
      >
        <h1 class="text-2xl font-extrabold text-[var(--text-main)] m-0">
          設定
        </h1>
      </div>
    </Teleport>

    <div
      class="mt-20 flex flex-col items-center justify-center p-8 bg-[var(--surface)] border border-[var(--line-soft)] rounded-2xl shadow-sm"
    >
      <i class="pi pi-check-circle text-4xl text-green-500 mb-4"></i>
      <h2 class="text-lg font-bold text-[var(--text-main)] mb-2">
        帳戶管理已遷移
      </h2>
      <p class="text-[var(--text-sub)] text-sm">
        為了讓您能更直覺地操作，所有的「帳戶新增、編輯、刪除」功能已經全部整併到
        <span class="font-bold text-[var(--primary)]">每月記錄</span> 頁面中囉！
      </p>
    </div>
  </div>
</template>
