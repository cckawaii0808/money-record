import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../supabase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
  // History 模式下, code 會出現在 query 中; Implicit flow 的 token 在 hash 中
  const hasCode = to.query.code || window.location.search.includes('code=');
  const hasToken = window.location.hash.includes('access_token');
  const isAuthCallback = hasCode || hasToken || window.location.hash.includes('type=recovery');

  if (requiresAuth && !isAuthenticated) {
    if (isAuthCallback) {
      // 如果發現是回調路徑,給予 Supabase 一點時間解析 URL 並更新 Session 狀態
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: retryData } = await supabase.auth.getSession();
      
      if (retryData.session) {
        // 登入成功！使用 replace 導向至主頁 (records)，這會清除網址列上的 code/token 參數
        return next({ path: "/records", replace: true });
      }
    }
    // 非回調路徑且未登入,跳轉至登入頁
    return next("/login");
  } 

  // 3. 已登入狀態下訪問登入頁,跳轉至首頁
  if (to.path === "/login" && isAuthenticated) {
    return next("/records");
  }

  // 4. 特殊處理：雖然已登入，但網址上仍殘留 code/token (可能是從登入頁被自動轉過來的)
  // 如果我們不清理，網址會變成 /records?code=...
  if (isAuthCallback && isAuthenticated) {
     return next({ path: to.path, query: {}, hash: '', replace: true });
  }

  next();
});

export { router };
