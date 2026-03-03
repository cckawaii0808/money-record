<script setup lang="ts">
/**
 * App.vue — Money Record Theme Exact Match Layout
 */
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Toast from "primevue/toast";
import { supabase } from "./supabase";
import { useAuth } from "./composables/useAuth";

const router = useRouter();
const route = useRoute();

// 取得登入狀態與使用者資訊
const { user, initAuth } = useAuth();

// 應用程式啟動時初始化 Auth 監聽器
onMounted(() => {
  initAuth();
});

// 計算 Google 頭像 URL（優先使用 avatar_url，其次 picture）
const avatarUrl = computed(
  () =>
    user.value?.user_metadata?.avatar_url ||
    user.value?.user_metadata?.picture ||
    null,
);

// 計算顯示名稱（優先使用 full_name，其次 name，最後 email）
const displayName = computed(
  () =>
    user.value?.user_metadata?.full_name ||
    user.value?.user_metadata?.name ||
    user.value?.email ||
    "",
);

const showNav = computed(() => route.meta.requiresAuth === true);

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

// 導覽項目分類 (如 Apollo 原版)
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

// 合併所有項目給手機底部用
const allNavItems = [...dashboardItems, ...appItems];

function isActive(path: string) {
  return route.path === path;
}

async function logout() {
  await supabase.auth.signOut();
  router.push("/login");
}
</script>

<template>
  <div class="flex min-h-[100dvh] bg-[var(--app-bg)]">
    <Toast position="top-center" />

    <template v-if="!showNav">
      <router-view />
    </template>

    <template v-else>
      <!-- 桌面側邊欄 -->
      <aside
        class="hidden lg:flex flex-col w-[250px] min-h-[100dvh] bg-[var(--sidebar-bg)] shadow-[var(--sidebar-shadow)] shrink-0 z-20 lg:sticky lg:top-0 lg:h-screen overflow-y-auto"
      >
        <!--  標誌區塊 -->
        <div class="flex items-center gap-3 p-6 h-[80px]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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

        <div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-6">
          <!-- 分類: DASHBOARDS -->
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
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-[0.9rem] font-semibold text-[var(--sidebar-text)] transition-all hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text)]"
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

          <!-- 分類: APPS -->
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
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline text-[0.9rem] font-semibold text-[var(--sidebar-text)] transition-all hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-text)]"
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

        <div class="flex gap-3 px-6 py-4 border-t border-[var(--line-soft)]">
          <button
            class="w-8 h-8 rounded-md border-none bg-transparent text-[var(--sidebar-text-muted)] cursor-pointer flex items-center justify-center transition-colors hover:text-[var(--sidebar-text)]"
            @click="toggleTheme"
            :title="isDark ? '切換淺色' : '切換深色'"
          >
            <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" />
          </button>
          <button
            class="w-8 h-8 rounded-md border-none bg-transparent text-[var(--sidebar-text-muted)] cursor-pointer flex items-center justify-center transition-colors hover:text-[var(--sidebar-text)]"
            @click="logout"
            title="登出"
          >
            <i class="pi pi-sign-out" />
          </button>
        </div>
      </aside>

      <!-- 主內容區 -->
      <main class="flex-1 min-w-0 flex flex-col relative">
        <!--  Top Bar (僅限電腦版顯示) -->
        <header
          class="hidden lg:flex justify-between items-center h-[80px] px-6 bg-[var(--app-bg)]/95 backdrop-blur-md sticky top-0 z-[60] border-b border-[var(--line-soft)] lg:border-none"
        >
          <div class="flex items-center gap-4">
            <button
              class="bg-transparent border-none text-[var(--text-sub)] text-xl cursor-pointer hidden"
            >
              <i class="pi pi-bars"></i>
            </button>
            <div
              class="text-sm font-semibold text-[var(--text-sub)] hidden sm:block"
            >
              資產總覽
            </div>
          </div>
          <!-- 使用者資訊區：顯示 Google 頭像與名稱 -->
          <div class="flex items-center gap-3">
            <!-- 顯示名稱 -->
            <span
              class="text-sm font-medium text-[var(--text-sub)] hidden sm:block"
            >
              {{ displayName }}
            </span>
            <!-- 頭像：有圖片用 img，否則用首字母 fallback -->
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
              {{ displayName.charAt(0).toUpperCase() }}
            </div>
          </div>
        </header>

        <!-- Router View Wrapper for padding -->
        <div class="flex-1">
          <router-view />
        </div>
      </main>

      <!-- 手機底部導覽列 -->
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
