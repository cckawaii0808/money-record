<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; isDesktop?: boolean; slotName?: string }>();
</script>

<template>
  <header class="page-intro workspace-header">
    <div class="workspace-header__copy"><h1>{{ title }}</h1><p v-if="subtitle" class="muted-label">{{ subtitle }}</p></div>
    <div class="workspace-header__controls"><slot /><slot name="extra" /></div>
  </header>
</template>

<style scoped>
.workspace-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
.workspace-header__copy h1 { font-size: 26px; font-weight: 700; letter-spacing: -.03em; }
.workspace-header__copy p { margin: 6px 0 0; font-size: 14px; }
.workspace-header__controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
@media (max-width: 640px) { .workspace-header__copy h1 { font-size: 23px; } .workspace-header__controls { width: 100%; justify-content: space-between; } }
</style>
