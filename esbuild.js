const { context } = require("esbuild");
const { build } = require("esbuild");
const postCssPlugin = require("esbuild-style-plugin");

const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

const extensionConfig = {
  ...baseConfig,
  platform: "node",
  mainFields: ["module", "main"],
  format: "cjs",
  entryPoints: ["./src/extension.ts"],
  outfile: "./out/extension.js",
  external: ["vscode"],
};

const webviewConfig = {
  ...baseConfig,
  target: "es2020",
  format: "esm",
  entryPoints: ["./app/index.tsx"],
  outfile: "./out/webview.js",
  plugins: [
    postCssPlugin({
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")],
      },
    }),
  ],
};

(async () => {
  const args = process.argv.slice(2);
  try {
    if (args.includes("--watch")) {
      console.log("[watch] build started");
      let extensionCtx = await context({
        ...extensionConfig,
      });
      let webviewCtx = await context({
        ...webviewConfig,
      });

      await extensionCtx.watch();
      await webviewCtx.watch();
      console.log("[watch] build finished");
    } else {
      await build(extensionConfig);
      await build(webviewConfig);
    }
  } catch (err) {
    console.log("--ERROR--", err);
    process.stderr.write(err.stderr);
    process.exit(1);
  }
})();
