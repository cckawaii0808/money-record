import { ref } from "vue";
import type { User } from "firebase/auth";
import { auth, googleProvider, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut } from "../firebase";

const user = ref<User | null>(null);
let _authSub: ReturnType<typeof onAuthStateChanged> | null = null;

export function useAuth() {
  /**
   * 初始化 Auth 狀態監聽器
   * 在 App.vue 的 onMounted 呼叫一次即可
   */
  async function initAuth() {
    if (!auth) return;

    // 清除舊的監聽器再重新訂閱，避免多次觸發
    if (_authSub) {
      _authSub();
    }

    // 處理 redirect 登入後的回調結果
    try {
      await getRedirectResult(auth);
    } catch (error: any) {
      console.error("Redirect result error:", error.message);
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
