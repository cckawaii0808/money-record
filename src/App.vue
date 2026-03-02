<script setup lang="ts">
/**
 * App.vue — 應用程式根元件
 * 包含：底部導覽列（手機）、側邊欄（桌面）、主畫面、全域 Toast
 */
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "primevue/toast";
import { supabase } from "./supabase";

const router = useRouter();
const route = useRoute();

// 是否顯示導覽（登入頁不顯示）
const showNav = computed(() => route.meta.requiresAuth === true);

// 深色模式
const isDark = ref(
  typeof window !== "undefined"
    ? document.documentElement.getAttribute("data-theme") === "dark"
    : false
);
function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute(
    "data-theme",
    isDark.value ? "dark" : "light"
  );
}

// 導覽項目
const navItems = [
  { name: "dashboard", path: "/dashboard", icon: "pi pi-chart-line", label: "總覽" },
  { name: "records",   path: "/records",   icon: "pi pi-calendar", label: "記錄" },
  { name: "settings",  path: "/settings",  icon: "pi pi-sliders-h", label: "設定" }
];

function isActive(path: string) {
  return route.path === path;
}

async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}
</script>

<template>
  <div class="app-root">
    <!-- 全域 Toast 通知 -->
    <Toast position="top-center" />

    <!-- 登入/未授權頁面：無導覽列 -->
    <template v-if="!showNav">
      <router-view />
    </template>

    <!-- 主應用佈局 -->
    <template v-else>
      <!-- 桌面側邊欄 -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <i class="pi pi-wallet" />
          <span>資金記錄</span>
        </div>

        <nav class="sidebar-nav">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="sidebar-link"
            :class="{ active: isActive(item.path) }"
          >
            <i :class="item.icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <button class="sidebar-icon-btn" @click="toggleTheme" :title="isDark ? '切換淺色' : '切換深色'">
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
          </button>
          <button class="sidebar-icon-btn" @click="logout" title="登出">
            <i class="pi pi-sign-out" />
          </button>
        </div>
      </aside>

      <!-- 主內容區 -->
      <main class="main-content">
        <router-view />
      </main>

      <!-- 手機底部導覽列 -->
      <nav class="bottom-nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="bottom-nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </template>
  </div>
</template>

<style scoped>
/* --- 整體容器 --- */
.app-root {
  display: flex;
  min-height: 100dvh;
  background: var(--app-bg);
}

/* ========================
   桌面側邊欄
   ======================== */
.sidebar {
  display: none; /* 手機預設隱藏 */
  flex-direction: column;
  width: 220px;
  min-height: 100dvh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--line-soft);
  padding: 24px 0;
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
  }
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 28px;
  font-size: 18px;
  font-weight: 800;
  color: var(--sidebar-text);
  border-bottom: 1px solid var(--line-soft);
}

.sidebar-logo i {
  font-size: 22px;
  color: var(--primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px 12px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--sidebar-text-muted);
  transition: all 0.15s ease;
}

.sidebar-link i {
  font-size: 16px;
}

.sidebar-link:hover {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-active-text);
}

.sidebar-link.active {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-active-text);
}

.sidebar-footer {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid var(--line-soft);
}

.sidebar-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--sidebar-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.sidebar-icon-btn:hover {
  background: var(--line-soft);
  color: var(--sidebar-text);
}

/* ========================
   主內容區
   ======================== */
.main-content {
  flex: 1;
  min-width: 0;
  min-height: 100dvh;
  overflow-x: hidden;
}

/* ========================
   手機底部導覽
   ======================== */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--surface);
  border-top: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  /* 安全區域（iOS 劉海）*/
  padding-bottom: env(safe-area-inset-bottom);
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-decoration: none;
  color: var(--text-sub);
  font-size: 10px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 12px;
  transition: color 0.15s;
  min-width: 64px;
}

.bottom-nav-item i {
  font-size: 20px;
  transition: color 0.15s;
}

.bottom-nav-item.active {
  color: var(--primary);
}

.bottom-nav-item.active i {
  color: var(--primary);
}
</style>
