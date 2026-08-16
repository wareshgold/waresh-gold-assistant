import { describe, expect, it } from "vitest";

import {
    AIToolExecutor
} from "./AIToolExecutor";


import {
    DefaultAIToolRegistry
} from "./DefaultAIToolRegistry";



describe("AIToolExecutor", () => {


    it("should execute registered tool", async () => {


        const registry =

            new DefaultAIToolRegistry();



        registry.register({

            name:

                "test_tool",


            description:

                "test tool",



            async execute(

                input

            ) {


                return {

                    success:

                        true,


                    data:

                        input

                };


            }


        });



        const executor =

            new AIToolExecutor(

                registry

            );



        const result =

            await executor.execute(

                "test_tool",

                {

                    value:

                        123

                },

                {

                    userId:

                        "user-1"

                }

            );



        expect(

            result.success

        ).toBe(true);



        expect(

            result.data

        ).toEqual({

            value:

                123

        });


    });





    it("should fail when tool does not exist", async () => {


        const registry =

            new DefaultAIToolRegistry();



        const executor =

            new AIToolExecutor(

                registry

            );



        const result =

            await executor.execute(

                "missing_tool",

                {},

                {}

            );



        expect(

            result.success

        ).toBe(false);



        expect(

            result.error

        ).toContain(

            "AI tool not found"

        );


    });





    it("should return tool execution error", async () => {


        const registry =

            new DefaultAIToolRegistry();



        registry.register({

            name:

                "failing_tool",



            description:

                "fails",



            async execute() {


                throw new Error(

                    "execution failed"

                );


            }


        });



        const executor =

            new AIToolExecutor(

                registry

            );



        const result =

            await executor.execute(

                "failing_tool",

                {},

                {}

            );



        expect(

            result.success

        ).toBe(false);



        expect(

            result.error

        ).toContain(

            "execution failed"

        );


    });



});