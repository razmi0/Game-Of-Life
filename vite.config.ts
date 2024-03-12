import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    eslint(),
  ],
  server: {
    hmr: true,
    port: 42069,
  },
  build: {
    target: "esnext",
  },
});
