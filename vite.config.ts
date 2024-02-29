import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    build: {
        lib: {
            entry: "src/lib.ts",
            name: "svelte-hemicycle",
            fileName: (format) => `svelte-hemicycle.${format}.js`,
        },
    },
});
