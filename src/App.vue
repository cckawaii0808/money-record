<script setup lang="ts">
import type { GlobalTheme, GlobalThemeOverrides, MenuOption } from "naive-ui";
import type { Component } from "vue";
import { computed, h, onMounted, onUnmounted, ref, watch } from "vue";
import {
  NAvatar,
  NButton,
  NConfigProvider,
  NDropdown,
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMessageProvider,
  NMenu,
  NSpace,
  NText,
  createDiscreteApi,
  darkTheme,
  dateZhTW,
  zhTW
} from "naive-ui";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useAssetManager } from "./features/asset-manager/composables/useAssetManager";
import { useAuth } from "./composables/useAuth";

const router = useRouter();
const route = useRoute();
const { fxRates, fxUpdatedLabel, fxLoading, refreshFxRates } = useAssetManager();
const { user, initAuth, logout } = useAuth();
const { message: discreteMessage } = createDiscreteApi(["message"]);

async function handleRefreshFx(): Promise<void> {
  const result = await refreshFxRates();
  if (result.type === "success") {
    discreteMessage.success(result.message, { duration: 1500 });
  } else {
    discreteMessage.error(result.message, { duration: 2500 });
  }
}
const isDark = ref(false);
const isMobile = ref(false);
const isSiderCollapsed = ref(false);
let mediaQuery: MediaQueryList | null = null;
let onMediaQueryChange: ((event: MediaQueryListEvent) => void) | null = null;

const naiveTheme = computed<GlobalTheme | null>(() => (isDark.value ? darkTheme : null));
const themeOverrides = computed<GlobalThemeOverrides>(() => ({
  common: {
    primaryColor: isDark.value ? "#2dd4bf" : "#0f766e",
    primaryColorHover: isDark.value ? "#5eead4" : "#0d9488",
    primaryColorPressed: isDark.value ? "#14b8a6" : "#115e59",
    primaryColorSuppl: isDark.value ? "#2dd4bf" : "#0f766e",
    borderRadius: "14px",
    fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif'
  }
}));

// SVG icon components for navigation
function svgIcon(paths: string[], viewBox = "0 0 24 24"): Component {
  return {
    render() {
      return h(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox,
          width: "20",
          height: "20",
          fill: "none",
          stroke: "currentColor",
          "stroke-width": "2",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        },
        paths.map((d) => h("path", { d }))
      );
    }
  };
}

const IconDashboard = svgIcon([
  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  "M9 22V12h6v10"
]);

const IconRecords = svgIcon([
  "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
  "M14 2v6h6",
  "M16 13H8",
  "M16 17H8",
  "M10 9H8"
]);

const IconAnalysis = svgIcon([
  "M18 20V10",
  "M12 20V4",
  "M6 20v-6"
]);

const IconLogout = svgIcon([
  "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
  "M16 17 L21 12 L16 7",
  "M21 12 H9"
]);

function renderMenuIcon(icon: Component): () => ReturnType<typeof h> {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  { label: "資產總覽", key: "/dashboard", icon: renderMenuIcon(IconDashboard) },
  { label: "每月記錄", key: "/records", icon: renderMenuIcon(IconRecords) },
  { label: "趨勢分析", key: "/analysis", icon: renderMenuIcon(IconAnalysis) }
];

const pageInfo = computed(() => {
  if (route.path.startsWith("/records")) {
    return { title: "每月記錄", subtitle: "記帳好習慣" };
  }
  if (route.path.startsWith("/analysis")) {
    return { title: "水位趨勢", subtitle: "資產水位變化" };
  }
  return { title: "資產總覽", subtitle: "整體資產狀態" };
});

const themeButtonTitle = computed(() => (isDark.value ? "切換淺色模式" : "切換深色模式"));
const themeButtonLabel = computed(() => (isDark.value ? "淺色模式" : "深色模式"));

const userOptions = [
  { label: "登出", key: "logout", icon: renderMenuIcon(IconLogout) }
];

// 判斷是否為登入頁面
const isLoginPage = computed(() => route.name === 'login' || route.path.startsWith('/login'));

function applyThemeToDocument(): void {
  document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");
}

function toggleTheme(): void {
  isDark.value = !isDark.value;
}

function toggleSider(): void {
  isSiderCollapsed.value = !isSiderCollapsed.value;
}

async function handleLogout() {
  await logout();
  router.push("/login");
}

function handleUserDropdownSelect(key: string | number) {
  if (key === "logout") {
    handleLogout();
  }
}

onMounted(() => {
  initAuth(); // 初始化驗證狀態

  try {
    const stored = localStorage.getItem("moneyrecord-theme");
    if (stored === "dark") {
      isDark.value = true;
    } else if (stored === "light") {
      isDark.value = false;
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  } catch {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyThemeToDocument();

  mediaQuery = window.matchMedia("(max-width: 1024px)");
  isMobile.value = mediaQuery.matches;
  isSiderCollapsed.value = isMobile.value;
  onMediaQueryChange = (event: MediaQueryListEvent) => {
    isMobile.value = event.matches;
    isSiderCollapsed.value = event.matches;
  };
  mediaQuery.addEventListener("change", onMediaQueryChange);
});

onUnmounted(() => {
  if (mediaQuery && onMediaQueryChange) {
    mediaQuery.removeEventListener("change", onMediaQueryChange);
  }
});

watch(isDark, () => {
  applyThemeToDocument();
  try {
    localStorage.setItem("moneyrecord-theme", isDark.value ? "dark" : "light");
  } catch {
    // ignore
  }
});

function onMenuUpdate(value: string | number): void {
  const path = String(value);
  if (route.path === path) {
    return;
  }
  router.push(path);
  if (isMobile.value) {
    isSiderCollapsed.value = true;
  }
}
</script>

<template>
  <NConfigProvider :locale="zhTW" :date-locale="dateZhTW" :theme="naiveTheme" :theme-overrides="themeOverrides">
    <NMessageProvider>
      <!-- 登入頁面不顯示 Layout -->
      <div v-if="isLoginPage" class="login-wrapper">
         <RouterView />
      </div>

      <!-- 主應用程式 Layout -->
      <NLayout v-else has-sider class="layout">
        <NLayoutSider
          :class="['sider', { 'sider-collapsed': isSiderCollapsed }]"
          :collapsed="isSiderCollapsed"
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          show-trigger
          bordered
          content-style="display: flex; flex-direction: column; height: 100%; overflow: hidden;"
          @update:collapsed="(val: boolean) => isSiderCollapsed = val"
        >
          <div class="brand">
            <div class="brand-mark">MR</div>
            <div v-show="!isSiderCollapsed" class="brand-copy">
              <div class="brand-title">MoneyRecord</div>
              <div class="brand-sub">資產管理系統</div>
            </div>
          </div>

          <!-- User Panel removed from Sidebar -->
          
          <div class="menu-wrap">
            <NMenu
              :value="route.path"
              :options="menuOptions"
              class="side-menu"
              :indent="16"
              @update:value="onMenuUpdate"
            />
          </div>

          <div class="sider-bottom">
            <div v-show="!isSiderCollapsed" class="fx-info">
              <div class="fx-header">
                <div class="fx-title">匯率</div>
                <NButton quaternary circle size="tiny" :loading="fxLoading" title="更新匯率" @click="handleRefreshFx">
                  <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M21 21v-5h-5" />
                    </svg>
                  </template>
                </NButton>
              </div>
              <div class="fx-rates">
                <div>USD {{ fxRates.USD.toFixed(2) }}</div>
                <div>JPY {{ fxRates.JPY.toFixed(4) }}</div>
              </div>
              <div class="fx-updated">{{ fxUpdatedLabel }}</div>
            </div>

            <div class="theme-toggle" @click="toggleTheme" :title="themeButtonTitle">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span v-show="!isSiderCollapsed" class="theme-label">{{ themeButtonLabel }}</span>
            </div>
          </div>
        </NLayoutSider>

        <NLayout class="main">
          <NLayoutHeader bordered class="topbar">
            <div class="topbar-left">
              <NButton
                v-if="isMobile && isSiderCollapsed"
                quaternary
                class="menu-btn"
                title="展開側邊欄"
                @click="toggleSider"
              >
                <span class="menu-icon">&#9776;</span>
              </NButton>
              <div class="topbar-copy">
                <div class="title">{{ pageInfo.title }}</div>
                <NText class="subtitle" depth="3">{{ pageInfo.subtitle }}</NText>
              </div>
            </div>

            <div class="topbar-right">
              
              <!-- User Info in Topbar -->
              <div class="user-info-group" v-if="user">
                <span class="user-greeting">{{ user.user_metadata?.full_name }} 你好</span>
                <NDropdown trigger="click" :options="userOptions" @select="handleUserDropdownSelect">
                  <NAvatar
                    round
                    size="small"
                    class="user-avatar"
                    :src="user.user_metadata?.avatar_url"
                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                  />
                </NDropdown>
              </div>
            </div>
          </NLayoutHeader>

          <NLayoutContent class="content">
            <div class="content-shell">
              <RouterView />
            </div>
          </NLayoutContent>
        </NLayout>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped>
.layout {
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

.login-wrapper {
  min-height: 100vh;
  background: var(--bg-body);
}

/* ── Sidebar ── */
.sider {
  border-right: 0;
  background: var(--sidebar-bg);
  box-shadow: inset -1px 0 0 var(--line-soft);
  z-index: 22;
}

.brand {
  padding: 20px 16px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sider-collapsed .brand {
  padding: 16px 8px 12px;
  justify-content: center;
}

.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #022c22;
  background: linear-gradient(145deg, #99f6e4, #2dd4bf);
  flex-shrink: 0;
}

.brand-copy {
  min-width: 0;
}

.brand-title {
  color: var(--text-main);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.1;
}

.brand-sub {
  color: var(--sidebar-text-muted);
  font-size: 11px;
  margin-top: 2px;
}



.menu-wrap {
  padding: 4px 8px 14px;
}

.sider-collapsed .menu-wrap {
  padding: 4px 6px 12px;
}

/* Menu item styling */
:deep(.side-menu .n-menu-item-content) {
  border-radius: 10px;
  color: var(--sidebar-text);
  height: 42px;
  margin-bottom: 2px;
  transition: all 0.15s ease;
}

:deep(.side-menu .n-menu-item-content-header) {
  color: inherit;
  font-weight: 600;
  font-size: 14px;
}

:deep(.side-menu .n-menu-item-content:hover) {
  background: color-mix(in srgb, var(--primary) 8%, transparent);
}

:deep(.side-menu .n-menu-item-content--selected) {
  background: transparent;
  color: var(--sidebar-active-text);
  font-weight: 700;
  border-left: 3px solid var(--sidebar-active-text);
  border-radius: 0;
  padding-left: 13px;
}

:deep(.side-menu .n-menu-item-content--selected:hover) {
  background: color-mix(in srgb, var(--primary) 6%, transparent);
}

:deep(.side-menu .n-menu-item-content__icon) {
  color: inherit;
  opacity: 0.7;
}

:deep(.side-menu .n-menu-item-content--selected .n-menu-item-content__icon) {
  opacity: 1;
}

.sider-collapsed :deep(.side-menu .n-menu-item-content) {
  justify-content: center;
  padding-inline: 0;
}

.sider-collapsed :deep(.side-menu .n-menu-item-content--selected) {
  border-left: none;
  border-bottom: none;
  border-radius: 10px;
  padding-left: 0;
}

/* ── Topbar ── */
.main {
  background: transparent;
  min-width: 0;
  overflow-y: auto;
}

.topbar {
  padding: 12px 24px;
  border-bottom: 1px solid var(--line-soft);
  background: var(--topbar-bg);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 12;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}



.topbar-copy {
  min-width: 0;
}

.menu-btn {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  color: var(--text-sub);
  background: color-mix(in srgb, var(--surface) 88%, transparent);
}

.menu-icon {
  font-size: 16px;
  line-height: 1;
}

.title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
}

.subtitle {
  font-size: 13px;
  color: var(--text-sub);
}

.sider-bottom {
  margin-top: auto;
}

.fx-info {
  padding: 16px;
  border-bottom: 1px solid var(--line-soft);
}

.fx-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.fx-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--sidebar-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fx-rates {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-mono, monospace);
  color: var(--text-main);
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
}

.fx-updated {
  font-size: 10px;
  color: var(--text-sub);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  color: var(--sidebar-text-muted);
  transition: color 0.15s ease;
}

.theme-toggle:hover {
  color: var(--sidebar-text);
}

.theme-toggle svg {
  flex-shrink: 0;
}

.theme-label {
  font-size: 12px;
  font-weight: 600;
}

/* ── Content ── */
.content {
  background: transparent;
}

.user-info-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 8px;
}

.user-greeting {
  font-size: 14px;
  color: var(--text-main);
  font-weight: 500;
}

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}
</style>
