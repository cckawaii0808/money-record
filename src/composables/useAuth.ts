import { ref } from "vue";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";

const user = ref<User | null>(null);

export function useAuth() {
  /**
   * 初始化 Auth 狀態監聽器
   * 在 App.vue 的 onMounted 呼叫一次即可
   */
  function initAuth() {
    // 1. 先取得當前的 Session
    supabase.auth.getSession().then(({ data }) => {
      user.value = data.session?.user ?? null;
    });

    // 2. 監聽 Session 變更 (登入、登出、Token 更新)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
    });
  }

  /**
   * Google 登入
   * 會導向到 Google 登入頁面，登入成功後會跳轉回來
   */
  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/records` // 登入後跳轉到記帳頁
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
