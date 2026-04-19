import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import { auth } from "./firebase";
import { getRedirectResult } from "firebase/auth";

// Tailwind CSS v4 + PrimeUI plugin（優先載入）
import "./styles/tailwind.css";
// PrimeVue icons
import "primeicons/primeicons.css";
// 應用程式 CSS 變數與全域樣式
import "./styles/variables.css";
import "./styles/global.css";


const app = createApp(App);
const pinia = createPinia();

app
  .use(pinia)
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        // 根據 data-theme 屬性切換深色/淺色模式
        darkModeSelector: '[data-theme="dark"]',
        cssLayer: false
      }
    }
  })
  .use(ToastService)
  .use(ConfirmationService);

// 在掛載前先處理 OAuth redirect 結果，確保 auth.currentUser 已就緒
// 避免 Router 守衛在 getRedirectResult 之前執行而誤判為未登入
async function bootstrap() {
  if (auth) {
    try {
      await getRedirectResult(auth);
    } catch (e: any) {
      console.error("Redirect result error:", e.code, e.message);
    }
  }
  app.mount("#app");
}

bootstrap();
