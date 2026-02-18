import { ref } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

const user = ref<User | null>(null);

export function useAuth() {
  /**
   * 初始化 Auth 狀態監聽器
   * 在 App.vue 的 onMounted 呼叫一次即可
   */
  async function initAuth() {
    // 1. 先取得當前的 Session
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;

    // 2. 監聽 Session 變更
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  }

  /**
   * Google 登入
   * 會導向到 Google 登入頁面，登入成功後會跳轉回來
   */
  async function loginWithGoogle() {
    // 自動根據當前環境生成跳轉路徑 (本地 dev 為 localhost, 正式為 github.io)
    const redirectUrl = window.location.origin + import.meta.env.BASE_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) {
      console.error("Google login error:", error.message);
      throw error;
    }
  }

  /**
   * 登出
   */
  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
    // 登出後 user.value 會由 onAuthStateChange 自動更新為 null
    // 可以在這裡強制跳轉回首頁，或由 Router Guard 處理
  }

  return {
    user,
    initAuth,
    loginWithGoogle,
    logout
  };
}
