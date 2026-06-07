<script setup lang="ts">
/**
 * MonthNavigator — 月份切換器（前/後月按鈕 + 月份顯示）
 *
 * 整合了 DashboardPage / RecordsPage 重複的月份導航邏輯。
 *
 * Props:
 *   modelValue - 當前選取月份 (YYYY-MM)
 *   months     - 所有可用月份列表
 *
 * Emits:
 *   update:modelValue - 月份變更時觸發
 */
import { computed } from "vue";
import Button from "primevue/button";

const props = defineProps<{
  modelValue: string;
  months: string[];
}>();

const emit = defineEmits<{
  "update:modelValue": [month: string];
}>();

const hasPrevious = computed(() => {
  const idx = props.months.indexOf(props.modelValue);
  return idx > 0;
});

const hasNext = computed(() => {
  const idx = props.months.indexOf(props.modelValue);
  return idx >= 0 && idx < props.months.length - 1;
});

function goPrevious() {
  const idx = props.months.indexOf(props.modelValue);
  if (idx > 0) {
    emit("update:modelValue", props.months[idx - 1]);
  }
}

function goNext() {
  const idx = props.months.indexOf(props.modelValue);
  if (idx < props.months.length - 1) {
    emit("update:modelValue", props.months[idx + 1]);
  }
}
</script>

<template>
  <div
    class="inline-flex items-center bg-[var(--surface)] px-2 py-1.5 rounded-[20px] shadow-sm border border-[var(--line-soft)]"
  >
    <Button
      icon="pi pi-chevron-left"
      text
      rounded
      :disabled="!hasPrevious"
      class="text-[var(--text-sub)] !p-2 h-10 w-10"
      @click="goPrevious"
    />
    <span
      class="w-36 text-center text-[15px] font-bold text-[var(--text-main)] tabular-nums select-none"
    >
      {{ modelValue }}
    </span>
    <Button
      icon="pi pi-chevron-right"
      text
      rounded
      :disabled="!hasNext"
      class="text-[var(--text-sub)] !p-2 h-10 w-10"
      @click="goNext"
    />
  </div>
</template>
