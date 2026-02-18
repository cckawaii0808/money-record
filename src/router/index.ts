import { createRouter, createWebHashHistory } from "vue-router";
import { supabase } from "../supabase";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/LoginPage.vue")
    },
    {
      path: "/",
      redirect: "/records"
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../pages/AssetDashboardPage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/analysis",
      name: "analysis",
      component: () => import("../pages/AssetAnalysisPage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/records",
      name: "records",
      component: () => import("../pages/AssetRecordsPage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/accounts",
      redirect: "/records"
    }
  ]
});

// 路由守衛：檢查是否已登入
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // 1. 取得當前 Session
  const { data } = await supabase.auth.getSession();
  let isAuthenticated = !!data.session;

  // 2. 處理 Auth 回調情況：
  // 在 Hash 模式下,Supabase 的回調資訊(如 access_token)可能出現在 Hash 中
  // 在 PKCE 模式下,code 可能出現在 Search (query) 中
  const isAuthCallback = 
    window.location.hash.includes('access_token') || 
    window.location.hash.includes('type=recovery') ||
    window.location.search.includes('code=');

  if (requiresAuth && !isAuthenticated) {
    if (isAuthCallback) {
      // 如果發現是回調路徑,給予 Supabase 一點時間解析 URL 並更新 Session 狀態
      // 解析完成後 onAuthStateChange 會被觸發,但這裡我們手動等待並重試 getSession
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: retryData } = await supabase.auth.getSession();
      if (retryData.session) {
        return next();
      }
    }
    // 非回調路徑且未登入,跳轉至登入頁
    return next("/login");
  } 

  // 3. 已登入狀態下訪問登入頁,跳轉至首頁
  if (to.path === "/login" && isAuthenticated) {
    return next("/records");
  }

  next();
});

export { router };
