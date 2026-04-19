import { ref } from "vue";
import type { User } from "firebase/auth";
import { auth, googleProvider, onAuthStateChanged, signInWithPopup, signOut } from "../firebase";

const user = ref<User | null>(null);
let _authSub: ReturnType<typeof onAuthStateChanged> | null = null;

export function useAuth() {
  /**
   * 初始化 Auth 狀態監聽器
   * 在 App.vue 的 onMounted 呼叫一次即可
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
   * Google 登入（popup 模式）
   * GitHub Pages 不設定 COOP 標頭，popup 可正常運作
   * signInWithRedirect 在 authDomain ≠ hosting domain 時無法取得結果
   */
  async function loginWithGoogle() {
    if (!auth || !googleProvider) {
       console.error("Firebase Auth 未初始化");
       return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
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
