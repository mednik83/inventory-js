import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8010",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: true,
  },
  plugins: [react(), basicSsl()],
});
