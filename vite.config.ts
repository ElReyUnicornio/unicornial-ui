import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      react(),
      // React Compiler only in dev. It injects require() calls that
      // break ESM library consumers (Rolldown runtime error).
      isDev ? babel({ presets: [reactCompilerPreset()] }) : [],
      tailwindcss(),
    ],
    publicDir: false,
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "UnicornialUI",
        formats: ["es", "umd"],
        fileName: (format) => `unicornial-ui.${format}.js`,
      },
      cssCodeSplit: false,
      rollupOptions: {
        external: ["react", "react-dom", /^react\/.*$/],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          interop: "auto",
          // Embed CSS as an inline <style> tag injection at the top of the JS
          // (UMD) or as a constructable stylesheet + document.adoptedStyleSheets
          // (ESM). Only works reliably when cssCodeSplit: false + single entry.
          inlineDynamicImports: true,
        },
      },
      sourcemap: true,
      emptyOutDir: true,
    },
  };
});
