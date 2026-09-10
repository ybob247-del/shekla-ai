import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Build-time only: bundles the app for server rendering so the prerender
// script can turn each public route into static HTML.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@catalog": path.resolve(__dirname, "./api/_catalog.ts"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    ssr: path.resolve(__dirname, "client/src/entry-server.tsx"),
    outDir: path.resolve(__dirname, "dist/server"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: "esm",
        entryFileNames: "entry-server.mjs",
      },
    },
  },
});
