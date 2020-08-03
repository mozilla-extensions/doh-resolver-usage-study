/* eslint-env node */

const defaultConfig = {
  sourceDir: "./src/",
  artifactsDir: "./dist/",
  ignoreFiles: [".DS_Store"],
  build: {
    overwriteDest: true,
  },
  run: {
    firefox: process.env.FIREFOX_BINARY || "firefox",
    browserConsole: true,
    startUrl: ["about:debugging"],
    pref: ["extensions.legacy.enabled=true", "extensions.experiments.enabled=true"],
  },
};

module.exports = defaultConfig;
