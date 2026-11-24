import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // The Express server serves frontend/build in production; keep the path.
    outDir: "build",
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 3000,
    proxy: { "/api": "http://localhost:4000" },
  },
});
