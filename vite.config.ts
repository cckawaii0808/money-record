import path from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: '/',
  plugins: [
    tailwindcss(), // Tailwind v4 Vite plugin
    vue()
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
