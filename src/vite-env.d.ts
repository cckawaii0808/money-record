/// <reference types="vite/client" />

/**
 * 宣告 .vue 模組的型別，讓 TypeScript 能夠識別 Vue 單檔案元件 (SFC)。
 * 沒有此宣告，TypeScript 會回報「找不到模組 '*.vue'」的錯誤。
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
