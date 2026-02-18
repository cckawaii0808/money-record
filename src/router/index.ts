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
  // 從 window 物件同步獲取 authReady 狀態 (或簡單等待)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // 取得當前 Session
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  if (requiresAuth && !isAuthenticated) {
    // 這裡多做一次嘗試：如果網址裡有 token 或 pkce code，等一下再判定
    if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
      // 稍微延遲一下，讓 Supabase 完成 URL 解析
      await new Promise(resolve => setTimeout(resolve, 800));
      const { data: retryData } = await supabase.auth.getSession();
      if (retryData.session) {
        return next();
      }
    }
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/records");
  } else {
    next();
  }
});

export { router };
