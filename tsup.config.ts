import { defineConfig } from "tsup";

const config = defineConfig({
  entry: ["src/extension.ts"],
  entryPoints: {
    "app/index.tsx": "app.js",
  },
  format: ["cjs"],
  shims: false,
  dts: false,
  outDir: "out",
  external: ["vscode"],
});

const appConfig = defineConfig({
  entry: ["app/index.tsx"],
  entryPoints: {
    "app/index.tsx": "app.js",
  },
  format: ["cjs"],
  shims: false,
  dts: false,
  outDir: "out",
  external: ["vscode", "react", "react-dom"],
});

export default [config, appConfig];
