import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../supabase";

const router = createRouter({
  history: createWebHistory(),
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
  
  // 取得當前 Session
  const { data } = await supabase.auth.getSession();
  const isAuthenticated = !!data.session;

  if (requiresAuth && !isAuthenticated) {
    // 未登入 -> 去登入頁
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    // 已登入 -> 去首頁
    next("/records");
  } else {
    // 放行
    next();
  }
});

export { router };
