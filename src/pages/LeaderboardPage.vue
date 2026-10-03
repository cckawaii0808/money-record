<script setup lang="ts">
import { watch } from "vue";
import PageHeader from "../components/common/PageHeader.vue";
import LeaderboardPanel from "../components/dashboard/LeaderboardPanel.vue";
import { useAuth } from "../composables/useAuth";
import { useAssetManagerStore } from "../stores";
import { isMockMode } from "../firebase";

const store = useAssetManagerStore();
const { user } = useAuth();

watch(() => isMockMode ? "local-demo" : user.value?.uid ?? null, (uid) => {
  if (uid) void store.initializeLeaderboard(uid, user.value?.displayName);
}, { immediate: true });
</script>

<template>
  <div class="workspace-page">
    <PageHeader title="淨資產排行榜" />
    <LeaderboardPanel />
  </div>
</template>
