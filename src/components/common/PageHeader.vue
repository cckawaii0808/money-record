<script setup lang="ts">
/**
 * PageHeader — 統一的頁面標題區塊
 *
 * 桌面版透過 Teleport 到 App.vue 的 #app-header-slot
 * 手機版顯示為 sticky 標題
 *
 * Props:
 *   title     - 頁面標題
 *   isDesktop - 是否為桌面版
 *   slotName  - Teleport target（預設 "#app-header-slot"）
 *
 * Slots:
 *   default   - 標題右側的控制項（月份導航、按鈕等）
 *   extra     - 標題左側額外控制（可選）
 */
import { Teleport } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    isDesktop: boolean;
    slotName?: string;
  }>(),
  {
    slotName: "#app-header-slot",
  }
);
</script>

<template>
  <Teleport defer :to="slotName" :disabled="!isDesktop">
    <div
      :class="
        isDesktop
          ? 'grid grid-cols-3 items-center w-full'
          : 'block text-center mb-6 sticky top-0 z-[50] bg-[var(--app-bg)]/95 backdrop-blur-md py-3 -mx-4 px-4'
      "
    >
      <!-- 標題（桌面版顯示） -->
      <h1
        v-if="isDesktop"
        class="text-2xl font-bold text-[var(--text-main)] m-0"
      >
        {{ title }}
      </h1>
      <div
        :class="
          isDesktop ? 'flex justify-center' : 'w-full flex justify-center'
        "
      >
        <slot />
      </div>
      <div v-if="isDesktop" class="flex justify-end gap-2 pr-2">
        <slot name="extra" />
      </div>
    </div>
  </Teleport>
</template>
