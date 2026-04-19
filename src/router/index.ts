import { createRouter, createWebHashHistory } from "vue-router";
import { auth, isMockMode } from "../firebase";

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

  let isAuthenticated = false;
  
  if (isMockMode) {
      isAuthenticated = true;
  } else if (auth) {
      // Firebase 需要等待 auth 狀態初始化完成
      await auth.authStateReady();
      isAuthenticated = !!auth.currentUser;
  }

  if (requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  if (to.path === "/login" && isAuthenticated) {
    return next("/dashboard");
  }

  next();
});

export { router };
