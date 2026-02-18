<script setup lang="ts">
import { ref } from "vue";
import { NButton, NCard, NSpace, NText, useMessage } from "naive-ui";
import { useAuth } from "../composables/useAuth";

const { loginWithGoogle } = useAuth();
const loading = ref(false);
const message = useMessage();

async function handleLogin() {
  loading.value = true;
  try {
    await loginWithGoogle();
    // 登入成功後，會由 Supabase 自動 redirect，這邊不用做什麼
  } catch (error: any) {
    message.error("登入失敗: " + error.message);
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <NCard class="login-card" :bordered="false" size="large">
      <template #header>
        <div class="header-content">
          <div class="logo">💰</div>
          <h1>MoneyRecord</h1>
          <p>您的資產管理好幫手</p>
        </div>
      </template>

      <NSpace vertical :size="24" align="center">
        <NText depth="3">
          請登入以同步您的資產資料，隨時掌握財富狀況。
        </NText>

        <NButton
          type="primary"
          size="large"
          class="google-btn"
          :loading="loading"
          @click="handleLogin"
        >
          <template #icon>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="google-icon">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
          </template>
          使用 Google 帳號登入
        </NButton>
      </NSpace>
    </NCard>
    
    <div class="footer">
      <NText depth="3" style="font-size: 12px;">
        &copy; {{ new Date().getFullYear() }} MoneyRecord
      </NText>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-body);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.header-content {
  margin-bottom: 10px;
}

.logo {
  font-size: 48px;
  margin-bottom: 16px;
}

h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
}

p {
  margin: 8px 0 0;
  color: var(--text-sub);
  font-size: 14px;
}

.google-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.footer {
  margin-top: 32px;
  opacity: 0.6;
}
</style>
