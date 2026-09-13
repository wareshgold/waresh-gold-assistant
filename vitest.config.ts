import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "dashboard/src"),
        },
    },
    test: {
        environment: "node",
        setupFiles: [
            "./test/application.setup.ts",
        ],
        include: [
            "src/**/*.spec.ts",
            "dashboard/**/*.spec.ts",
        ],
    },
});
