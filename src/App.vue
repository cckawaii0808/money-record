<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import Popover from "primevue/popover";
import { useAuth } from "./composables/useAuth";

const router = useRouter();
const route = useRoute();
const { user, initAuth, logout } = useAuth();
onMounted(initAuth);
const showNav = computed(() => route.meta.requiresAuth === true);
const displayName = computed(() => user.value?.displayName || user.value?.email || "我的工作台");
const profileMenu = ref();
const isDark = ref(document.documentElement.getAttribute("data-theme") === "dark");
function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");
}
async function handleLogout() {
  profileMenu.value?.hide();
  await logout();
  await router.push("/login");
}
const navItems = [
  { path: "/dashboard", icon: "pi pi-chart-bar", label: "資產總覽" },
  { path: "/records", icon: "pi pi-table", label: "每月記錄" },
  { path: "/investments", icon: "pi pi-chart-line", label: "投資組合" },
  { path: "/leaderboard", icon: "pi pi-trophy", label: "排行榜" },
];
</script>

<template>
  <div class="app-shell">
    <Toast position="bottom-right" :pt="{ root: { class: 'app-toast' } }" />
    <ConfirmDialog />
    <template v-if="showNav">
      <header class="app-topbar">
        <div class="app-topbar__inner">
          <RouterLink to="/dashboard" class="app-brand" aria-label="Money Record 資產總覽">
            <span class="app-brand__mark"><i class="pi pi-chart-line" aria-hidden="true" /></span>
            <span>Money<span class="app-brand__secondary"> Record</span></span>
          </RouterLink>
          <nav class="app-navigation" aria-label="主要選單">
            <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="{ active: route.path === item.path }">
              <i :class="item.icon" aria-hidden="true" /><span>{{ item.label }}</span>
            </RouterLink>
          </nav>
          <div class="app-user-actions">
            <button class="icon-control" :aria-label="isDark ? '切換淺色模式' : '切換深色模式'" @click="toggleTheme"><i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" /></button>
            <button class="profile-control" aria-label="開啟使用者選單" @click="profileMenu.toggle($event)">
              <img v-if="user?.photoURL" :src="user.photoURL" :alt="displayName" referrerpolicy="no-referrer" />
              <span v-else class="profile-initial">{{ displayName.charAt(0) }}</span>
              <span class="profile-name">{{ displayName }}</span><i class="pi pi-angle-down" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <Popover ref="profileMenu">
        <div class="profile-menu">
          <strong>{{ displayName }}</strong><span class="muted-label">{{ user?.email }}</span>
          <button @click="toggleTheme"><i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />{{ isDark ? '淺色模式' : '深色模式' }}</button>
          <button @click="handleLogout"><i class="pi pi-sign-out" />登出</button>
        </div>
      </Popover>
    </template>
    <main><RouterView /></main>
  </div>
</template>
