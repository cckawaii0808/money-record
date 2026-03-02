import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

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
  .use(ConfirmationService)
  
app.mount("#app");
