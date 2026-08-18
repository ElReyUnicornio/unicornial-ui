import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Inline plugin: prepends a relative CSS import at the very top of the ESM
// output so bundlers auto-include styles without users importing them manually.
function autoImportCssPlugin() {
  const CSS_FILENAME = "unicornial-ui.css";
  return {
    name: "auto-import-css",
    renderChunk(
      code: string,
      _chunk: { fileName: string; modules: Record<string, unknown> },
      opts: { format: string },
    ): string | null {
      if (opts.format !== "es") return null;
      return `import "./${CSS_FILENAME}";\n${code}`;
    },
  };
}

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
      autoImportCssPlugin(),
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
        },
      },
      sourcemap: true,
      emptyOutDir: true,
    },
  };
});
