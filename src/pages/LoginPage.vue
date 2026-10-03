<script setup lang="ts">
/**
 * LoginPage — 登入頁面
 * 使用原生 scoped CSS 確保樣式在生產環境正確套用，避免 Tailwind arbitrary values 可能的問題
 */
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { loginWithGoogle, user } = useAuth();
const loading = ref(false);
const errorMsg = ref("");

watch(user, (newUser) => {
  if (newUser) router.push("/dashboard");
});

async function handleLogin() {
  /* 防止重複點擊 */
  if (loading.value) return;
  loading.value = true;
  errorMsg.value = "";
  try {
    await loginWithGoogle();
  } catch (error: any) {
    errorMsg.value = "登入失敗：" + (error.message ?? "請稍後再試");
    loading.value = false;
  }
}
</script>

<template>
  <main class="login-bg">
    <section class="workspace-panel login-card" aria-labelledby="login-heading">
      <!-- Logo 圖示 -->
      <div class="login-logo">
        <i class="pi pi-wallet login-logo-icon" aria-hidden="true" />
      </div>

      <!-- 標題 -->
      <p class="login-eyebrow">個人金融工作台</p>
      <h1 id="login-heading" class="login-title">資金記錄</h1>
      <p class="login-subtitle">整理每月帳戶餘額與投資持倉，<br />清楚掌握資產變化。</p>
      <div class="login-features" aria-label="工作台功能">
        <span><i class="pi pi-list" aria-hidden="true"></i>每月記錄</span>
        <span><i class="pi pi-chart-line" aria-hidden="true"></i>投資追蹤</span>
        <span><i class="pi pi-wallet" aria-hidden="true"></i>資產總覽</span>
      </div>

      <!-- 錯誤訊息提示框 -->
      <div v-if="errorMsg" class="login-error" role="alert">
        {{ errorMsg }}
      </div>

      <!-- Google 登入按鈕 -->
      <button
        class="login-btn"
        type="button"
        aria-label="使用 Google 帳號登入資金記錄"
        :aria-busy="loading"
        :class="{ 'login-btn--loading': loading }"
        :disabled="loading"
        @click="handleLogin"
      >
        <!-- Google Logo SVG -->
        <svg
          v-if="!loading"
          viewBox="0 0 48 48"
          width="20"
          height="20"
          class="login-btn-icon"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        <!-- 載入中旋轉圖示 -->
        <i v-else class="pi pi-spin pi-spinner login-btn-icon" aria-hidden="true" />
        <span aria-live="polite">{{ loading ? '登入中…' : '使用 Google 帳號登入' }}</span>
      </button>

      <!-- 版權 -->
      <p class="login-footer">© {{ new Date().getFullYear() }} MoneyRecord</p>
    </section>
  </main>
</template>

<style scoped>
/* ===== 全螢幕置中背景 ===== */
.login-bg {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--app-bg);
  padding: 20px;
}

/* ===== 登入卡片 ===== */
.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.025);
}

/* ===== Logo ===== */
.login-logo {
  width: 40px;
  height: 40px;
  background: var(--primary-soft);
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.login-logo-icon {
  font-size: 19px;
  color: var(--primary);
}

/* ===== 標題文字 ===== */
.login-title {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 650;
  color: var(--text-main);
}

.login-subtitle {
  margin: 0 0 20px;
  font-size: 0.875rem;
  color: var(--text-sub);
  line-height: 1.7;
}

.login-eyebrow { margin: 0 0 8px; font-size: 11px; color: var(--text-sub); letter-spacing: 0.08em; }
.login-features { display: flex; justify-content: space-between; gap: 8px; padding: 14px 0; margin-bottom: 22px; border-block: 1px solid var(--line-soft); color: var(--text-sub); font-size: 11px; }
.login-features span { display: flex; align-items: center; gap: 5px; }

/* ===== 錯誤訊息 ===== */
.login-error {
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--negative);
  margin-bottom: 16px;
  text-align: left;
}

/* ===== Google 登入按鈕 ===== */
.login-btn {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--surface);
  color: var(--text-main);
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    opacity 0.2s;
  font-family: inherit;
}

.login-btn:hover:not(:disabled) {
  background: var(--app-bg);
}

.login-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

/* 載入中狀態 */
.login-btn--loading,
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn-icon {
  flex-shrink: 0;
}

/* ===== 版權文字 ===== */
.login-footer {
  margin: 24px 0 0;
  font-size: 12px;
  color: var(--text-sub);
}

@media (max-width: 400px) { .login-card { padding: 24px 20px; } }
</style>
