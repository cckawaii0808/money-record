import path from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  base: '/money-record/',
  plugins: [// Tailwind v4 Vite plugin
  tailwindcss(), vue(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});