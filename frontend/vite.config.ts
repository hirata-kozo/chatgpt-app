import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 開発時は /api → http://localhost:3001 にプロキシ
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});

