import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	clean: true,
	dts: true,
	entryPoints: ["src/index.ts", "src/adapters/*/index.ts"],
	format: ["cjs", "esm"],
	outDir: "dist",
	sourcemap: true,
	splitting: false,
	...options
}));
