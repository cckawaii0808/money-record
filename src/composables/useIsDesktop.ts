import { ref, onMounted, onUnmounted } from "vue";

/** 偵測目前是否為桌面版（lg: >= 1024px），響應式更新 */
export function useIsDesktop() {
  const isDesktop = ref(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );

  function onResize() {
    isDesktop.value = window.innerWidth >= 1024;
  }

  onMounted(() => window.addEventListener("resize", onResize));
  onUnmounted(() => window.removeEventListener("resize", onResize));

  return { isDesktop };
}
