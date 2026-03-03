<script setup lang="ts">
/**
 * App.vue — Money Record Layout
 */
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "primevue/toast";
import Popover from "primevue/popover";
import { useAuth } from "./composables/useAuth";

const router = useRouter();
const route = useRoute();

const { user, initAuth, logout } = useAuth();

onMounted(() => {
  initAuth();
});

// ── 使用者資訊 ────────────────────────────────────────────────────────────

const avatarUrl = computed(
  () =>
    user.value?.user_metadata?.avatar_url ||
    user.value?.user_metadata?.picture ||
    null,
);

const displayName = computed(
  () =>
    user.value?.user_metadata?.full_name ||
    user.value?.user_metadata?.name ||
    user.value?.email ||
    "",
);

// ── 導覽控制 ──────────────────────────────────────────────────────────────

const showNav = computed(() => route.meta.requiresAuth === true);
const sidebarOpen = ref(true);

// ── 深色模式 ──────────────────────────────────────────────────────────────

const isDark = ref(
  typeof window !== "undefined"
    ? document.documentElement.getAttribute("data-theme") === "dark"
    : false,
);

function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute(
    "data-theme",
    isDark.value ? "dark" : "light",
  );
}

// ── 頭像下拉選單 ──────────────────────────────────────────────────────────

const profileMenu = ref();

async function handleLogout() {
  profileMenu.value?.hide();
  await logout();
  router.push("/login");
}

// ── 導覽項目 ──────────────────────────────────────────────────────────────

const dashboardItems = [
  { name: "dashboard", path: "/dashboard", icon: "pi pi-home", label: "總覽" },
];
const appItems = [
  { name: "records", path: "/records", icon: "pi pi-list", label: "記錄" },
  {
    name: "investments",
    path: "/investments",
    icon: "pi pi-chart-line",
    label: "投資組合",
  },
  { name: "settings", path: "/settings", icon: "pi pi-cog", label: "設定" },
];

const allNavItems = [...dashboardItems, ...appItems];

function isActive(path: string) {
  return route.path === path;
}
</script>

<template>
  <div class="min-h-[100dvh] bg-[var(--app-bg)]">
    <Toast position="top-center" />

    <template v-if="!showNav">
      <router-view />
    </template>

    <template v-else>
      <!-- ── 桌面側邊欄（fixed） ───────────────────────────────────────── -->
      <aside
        :class="[
          'fixed top-0 left-0 z-[70] h-screen',
          'hidden lg:flex flex-col w-[250px]',
          'bg-[var(--sidebar-bg)] shadow-[var(--sidebar-shadow)]',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <!-- Logo -->
        <div class="flex items-center gap-3 px-6 h-[80px] shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 22H6L12 10L18 22H22L12 2Z" fill="var(--primary)" />
            <path
              d="M12 2L18 14H14L12 10L10 14H6L12 2Z"
              fill="var(--primary-hover)"
            />
          </svg>
          <span
            class="text-[1.25rem] tracking-[0.1em] font-extrabold text-[var(--primary)]"
            >Money Record</span
          >
        </div>

        <!-- 導覽項目 -->
        <div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-6">
          <div>
            <div
              class="text-[0.7rem] font-extrabold tracking-[0.1em] text-[var(--primary)] mb-2 px-3"
            >
              DASHBOARDS
            </div>
            <nav class="flex flex-col gap-1">
              <router-link
                v-for="item in dashboardItems"
                :key="item.name"
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-[0.9rem] font-semibold text-[var(--sidebar-text)] transition-all hover:bg-[var(--sidebar-active-bg)]"
                :class="{
                  'bg-[var(--sidebar-active-bg)] !text-[var(--sidebar-active-text)]':
                    isActive(item.path),
                }"
              >
                <i
                  :class="[
                    item.icon,
                    'text-[1.1rem] w-5 text-center',
                    isActive(item.path)
                      ? '!text-[var(--sidebar-active-text)]'
                      : 'text-[var(--sidebar-text-muted)]',
                  ]"
                />
                <span>{{ item.label }}</span>
              </router-link>
            </nav>
          </div>

          <div>
            <div
              class="text-[0.7rem] font-extrabold tracking-[0.1em] text-[var(--primary)] mb-2 px-3"
            >
              APPS
            </div>
            <nav class="flex flex-col gap-1">
              <router-link
                v-for="item in appItems"
                :key="item.name"
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-[0.9rem] font-semibold text-[var(--sidebar-text)] transition-all hover:bg-[var(--sidebar-active-bg)]"
                :class="{
                  'bg-[var(--sidebar-active-bg)] !text-[var(--sidebar-active-text)]':
                    isActive(item.path),
                }"
              >
                <i
                  :class="[
                    item.icon,
                    'text-[1.1rem] w-5 text-center',
                    isActive(item.path)
                      ? '!text-[var(--sidebar-active-text)]'
                      : 'text-[var(--sidebar-text-muted)]',
                  ]"
                />
                <span>{{ item.label }}</span>
              </router-link>
            </nav>
          </div>
        </div>
      </aside>

      <!-- ── 主內容區（配合 sidebar fixed，加 margin-left） ────────────── -->
      <div
        :class="[
          'flex flex-col min-h-[100dvh]',
          'transition-[margin] duration-300 ease-in-out',
          sidebarOpen ? 'lg:ml-[250px]' : 'lg:ml-0',
        ]"
      >
        <!-- Top Bar -->
        <header
          class="hidden lg:flex justify-between items-center h-[80px] px-6 bg-[var(--app-bg)]/95 backdrop-blur-md sticky top-0 z-[60] border-b border-[var(--line-soft)]"
        >
          <!-- 漢堡按鈕 -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent border-none text-[var(--text-sub)] text-xl cursor-pointer hover:bg-[var(--sidebar-active-bg)] transition-colors shrink-0"
            :title="sidebarOpen ? '收起選單' : '展開選單'"
            @click="sidebarOpen = !sidebarOpen"
          >
            <i class="pi pi-bars"></i>
          </button>

          <!-- 頁面標題 / 控制項 slot（各頁面透過 Teleport 注入） -->
          <div id="app-header-slot" class="flex-1 flex items-center justify-between min-w-0 px-2"></div>

          <!-- 右側：使用者資訊（可點擊展開 Popover） -->
          <div
            class="flex items-center gap-3 cursor-pointer select-none rounded-xl px-3 py-1.5 hover:bg-[var(--sidebar-active-bg)] transition-colors"
            @click="profileMenu.toggle($event)"
          >
            <span class="text-sm font-medium text-[var(--text-sub)] hidden sm:block">
              {{ displayName }}
            </span>
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              referrerpolicy="no-referrer"
              class="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-[var(--line-soft)]"
            />
            <div
              v-else
              class="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-sm"
              style="background: var(--primary)"
            >
              {{ displayName.charAt(0).toUpperCase() || "?" }}
            </div>
          </div>
        </header>

        <!-- 頭像 Popover 下拉選單 -->
        <Popover ref="profileMenu">
          <div class="flex flex-col gap-0.5 p-1" style="min-width: 210px">
            <!-- 使用者資訊 -->
            <div
              class="px-3 py-2.5 mb-0.5 border-b border-[var(--line-soft)]"
            >
              <p class="font-bold text-sm text-[var(--text-main)] leading-tight">
                {{ displayName }}
              </p>
              <p class="text-xs text-[var(--text-sub)] mt-0.5">
                {{ user?.email }}
              </p>
            </div>
            <!-- 深色/淺色切換 -->
            <button
              class="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-left bg-transparent border-none cursor-pointer text-[var(--text-main)] hover:bg-[var(--sidebar-active-bg)] transition-colors font-[inherit]"
              @click="toggleTheme"
            >
              <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-base" />
              <span>{{ isDark ? "切換淺色模式" : "切換深色模式" }}</span>
            </button>
            <!-- 登出 -->
            <button
              class="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-left bg-transparent border-none cursor-pointer text-red-500 hover:bg-red-50 transition-colors font-[inherit]"
              @click="handleLogout"
            >
              <i class="pi pi-sign-out text-base" />
              <span>登出</span>
            </button>
          </div>
        </Popover>

        <!-- 頁面內容 -->
        <main class="flex-1">
          <router-view />
        </main>
      </div>

      <!-- ── 手機底部導覽列 ──────────────────────────────────────────────── -->
      <nav
        class="fixed bottom-0 left-0 right-0 h-[70px] bg-[var(--surface-elev)] backdrop-blur-md border-t border-[var(--line-soft)] flex items-center justify-around z-[100] pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <router-link
          v-for="item in allNavItems"
          :key="item.name"
          :to="item.path"
          class="flex flex-col items-center gap-1 no-underline text-[var(--text-muted)] text-[11px] font-semibold p-2.5 transition-colors min-w-[64px]"
          :class="{ '!text-[var(--sidebar-active-text)]': isActive(item.path) }"
        >
          <i
            :class="[
              item.icon,
              'text-[22px] transition-transform duration-200',
              isActive(item.path) ? '-translate-y-0.5' : '',
            ]"
          />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </template>
  </div>
</template>

