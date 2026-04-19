import { ref } from "vue";
import type { User } from "firebase/auth";
import { auth, googleProvider, onAuthStateChanged, signInWithRedirect, signOut } from "../firebase";

const user = ref<User | null>(null);
let _authSub: ReturnType<typeof onAuthStateChanged> | null = null;

export function useAuth() {
  /**
   * 初始化 Auth 狀態監聽器
   * 在 App.vue 的 onMounted 呼叫一次即可
   * 注意：getRedirectResult 已移至 main.ts 在掛載前執行，避免時序競爭
   */
  function initAuth() {
    if (!auth) return;

    if (_authSub) {
      _authSub();
    }

    _authSub = onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });
  }

  /**
   * Google 登入（redirect 模式，相容 GitHub Pages）
   */
  async function loginWithGoogle() {
    if (!auth || !googleProvider) {
       console.error("Firebase Auth 未初始化");
       return;
    }
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Google login error:", error.message);
      throw error;
    }
  }

  /**
   * 登出
   */
  async function logout() {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  }

  return {
    user,
    initAuth,
    loginWithGoogle,
    logout
  };
}
