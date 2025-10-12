import { defineConfig } from "tsup";

export default defineConfig({
    format: ["esm", "cjs"],
    entry: ["src/index.ts"],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    platform: "neutral", // Make it work in both Node.js and browser
});