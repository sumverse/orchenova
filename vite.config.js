import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/apiv2": {
        target: "https://freesound.org",
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
});
