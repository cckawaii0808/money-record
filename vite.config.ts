import path from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: '/money-record/',
  plugins: [vue(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});