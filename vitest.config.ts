import { defineConfig } from "vitest/config";


export default defineConfig({

    test: {

        environment: "node",

        setupFiles: [

            "./test/application.setup.ts"

        ],

        include: [

            "src/**/*.spec.ts"

        ]

    }

});