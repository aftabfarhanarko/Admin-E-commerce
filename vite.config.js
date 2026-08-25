import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2020",
    minify: "esbuild",

    rollupOptions: {
      output: {
        manualChunks(id) {
          // ONLY split vendor (safe)
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },

  server: {
    watch: {
      ignored: ["**/.pnpm-store/**", "**/node_modules/**"],
    },
    proxy: {
      "/pathao-api": {
        target: "https://api-hermes.pathao.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pathao-api/, ""),
      },
    },
  },
});