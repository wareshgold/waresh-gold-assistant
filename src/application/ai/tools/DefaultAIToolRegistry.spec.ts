import { describe, expect, it } from "vitest";

import {
    DefaultAIToolRegistry
} from "./DefaultAIToolRegistry";


import {
    AITool
} from "./AITool";



describe("DefaultAIToolRegistry", () => {


    it("should register and retrieve tool", () => {


        const registry =

            new DefaultAIToolRegistry();



        const tool: AITool = {


            name:

                "test_tool",


            description:

                "test description",



            async execute() {

                return {

                    success:

                        true

                };

            }


        };



        registry.register(tool);



        expect(

            registry.getTool("test_tool")

        ).toBe(tool);



    });




    it("should return all registered tools", () => {


        const registry =

            new DefaultAIToolRegistry();



        registry.register({

            name:

                "tool_one",


            description:

                "one",


            async execute() {

                return {

                    success:

                        true

                };

            }

        });



        registry.register({

            name:

                "tool_two",


            description:

                "two",


            async execute() {

                return {

                    success:

                        true

                };

            }

        });



        expect(

            registry.getTools()

        ).toHaveLength(2);



    });




    it("should return tool definitions", () => {


        const registry =

            new DefaultAIToolRegistry();



        registry.register({

            name:

                "test_tool",


            description:

                "test description",



            async execute() {

                return {

                    success:

                        true

                };

            }


        });



        const definitions =

            registry.getToolDefinitions();



        expect(

            definitions

        ).toHaveLength(1);



        expect(

            definitions[0]

        ).toEqual({

            name:

                "test_tool",


            description:

                "test description",


            parameters:

                undefined

        });



    });




    it("should return undefined for unknown tool", () => {


        const registry =

            new DefaultAIToolRegistry;



        expect(

            registry.getTool("missing")

        ).toBeUndefined();



    });



});