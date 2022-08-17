import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      formats: ["cjs", "es"],
      entry: "./lib/index.js",
      name: "xeonic",
      fileName: "xeonic",
    },
  },
});
