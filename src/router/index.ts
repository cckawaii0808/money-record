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
      redirect: "/dashboard"
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../pages/DashboardPage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/records",
      name: "records",
      component: () => import("../pages/RecordsPage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/investments",
      name: "investments",
      component: () => import("../pages/InvestmentsPage.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../pages/SettingsPage.vue"),
      meta: { requiresAuth: true }
    }
  ]
});

// 路由守衛：檢查是否已登入
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const { data } = await supabase.auth.getSession();
  let isAuthenticated = !!data.session;

  const hasCode = to.query.code || window.location.search.includes("code=");
  const hasToken = window.location.hash.includes("access_token");
  const isAuthCallback = hasCode || hasToken || window.location.hash.includes("type=recovery");

  if (requiresAuth && !isAuthenticated) {
    if (isAuthCallback) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data: retryData } = await supabase.auth.getSession();
      if (retryData.session) {
        return next({ path: "/dashboard", replace: true });
      }
    }
    return next("/login");
  }

  if (to.path === "/login" && isAuthenticated) {
    return next("/dashboard");
  }

  if (isAuthCallback && isAuthenticated) {
    return next({ path: to.path, query: {}, hash: "", replace: true });
  }

  next();
});

export { router };
