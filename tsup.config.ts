import { defineConfig } from "tsup";
import path from "path";
const config = defineConfig({
  entry: ["src/extension.ts"],
  shims: false,
  dts: false,
  outDir: "out",
  external: ["vscode"],
});

const appConfig = defineConfig({
  entry: ["app/index.tsx"],
  dts: false,
  minify: true,
  bundle: true,
  sourcemap: true,
  outDir: "out",
  minifyWhitespace: true,
  loader: { ".ts": "tsx" },
});

export default [config, appConfig];
