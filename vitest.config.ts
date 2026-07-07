import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: { environment: "node" },
	esbuild: { jsx: "automatic" },
	resolve: {
		// Mirrors tsconfig `paths`: registry sources import the way consuming
		// apps do (`@/components/ui/…`, `@/lib/utils`).
		alias: [
			{
				find: /^@\/components\/ui\/(.*)$/,
				replacement: fileURLToPath(new URL("registry/ui/$1", import.meta.url)),
			},
			{
				find: /^@\/(.*)$/,
				replacement: fileURLToPath(new URL("$1", import.meta.url)),
			},
		],
	},
});
