<script setup lang="ts">
/**
 * LoginPage — 登入頁面（PrimeVue 版）
 */
import { ref } from "vue";
import Button from "primevue/button";
import { useAuth } from "../composables/useAuth";

const { loginWithGoogle } = useAuth();
const loading = ref(false);
const errorMsg = ref("");

async function handleLogin() {
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
  <div class="min-h-[100dvh] flex items-center justify-center bg-[var(--app-bg)] p-5">
    <div class="w-full max-w-[360px] bg-[var(--surface)] border border-[var(--line-soft)] rounded-[20px] px-8 py-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
      <!-- Logo -->
      <div class="w-[60px] h-[60px] bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-5">
        <i class="pi pi-wallet text-[28px] text-white" />
      </div>
      <h1 class="m-0 mb-2 text-2xl font-extrabold text-[var(--text-main)]">資金記錄</h1>
      <p class="m-0 mb-7 text-sm text-[var(--text-sub)] leading-snug">每月追蹤您的資產變化，掌握財富成長</p>

      <div v-if="errorMsg" class="bg-red-600/10 border border-red-600/20 rounded-lg px-3.5 py-2.5 text-[13px] text-[var(--negative)] mb-4">
        {{ errorMsg }}
      </div>

      <Button
        class="h-12 text-[15px] font-semibold flex justify-center w-full"
        :loading="loading"
        @click="handleLogin"
      >
        <template #icon>
          <svg viewBox="0 0 48 48" width="18" height="18" class="mr-2">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </template>
        使用 Google 帳號登入
      </Button>

      <p class="mt-6 text-xs text-[var(--text-sub)] opacity-60">© {{ new Date().getFullYear() }} MoneyRecord</p>
    </div>
  </div>
</template>
