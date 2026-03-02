import path from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/money-record/',
  plugins: [
    tailwindcss(), // Tailwind v4 Vite plugin
    vue()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
