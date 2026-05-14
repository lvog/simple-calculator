import { defineConfig } from "vite";

export default defineConfig({
  base: "",
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "style[extname]",
        entryFileNames: "main.js",
      },
    },
  },
});
