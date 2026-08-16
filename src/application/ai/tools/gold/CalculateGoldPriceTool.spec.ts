import { describe, expect, it } from "vitest";


import {
    CalculateGoldPriceTool
} from "./CalculateGoldPriceTool";


import {
    DefaultAIToolRegistry
} from "../DefaultAIToolRegistry";


import {
    AIToolExecutor
} from "../AIToolExecutor";



describe("CalculateGoldPriceTool", () => {



    it("should calculate gold price successfully", async () => {


        const useCase = {


            async execute(input: unknown) {


                return {

                    input,


                    total:

                        25000000

                };


            }


        } as any;




        const tool =

            new CalculateGoldPriceTool(

                useCase

            );



        const registry =

            new DefaultAIToolRegistry();



        registry.register(

            tool

        );



        const executor =

            new AIToolExecutor(

                registry

            );




        const result =

            await executor.execute(

                "calculate_gold_price",

                {

                    weight:

                        2,


                    goldPrice:

                        19000000,


                    laborPercent:

                        10,


                    profitPercent:

                        7,


                    taxPercent:

                        10


                },

                {

                    userId:

                        "user-1"

                }

            );



        expect(result.success)

            .toBe(true);



        expect(result.data)

            .toEqual({

                input:

                {

                    weight:

                        2,


                    goldPrice:

                        19000000,


                    laborPercent:

                        10,


                    profitPercent:

                        7,


                    taxPercent:

                        10

                },


                total:

                    25000000

            });



    });






    it("should reject invalid negative values before execution", async () => {



        const useCase = {


            async execute() {


                throw new Error(

                    "use case should not execute"

                );


            }


        } as any;




        const tool =

            new CalculateGoldPriceTool(

                useCase

            );



        const registry =

            new DefaultAIToolRegistry();



        registry.register(

            tool

        );



        const executor =

            new AIToolExecutor(

                registry

            );



        const result =

            await executor.execute(

                "calculate_gold_price",

                {

                    weight:

                        -1,


                    goldPrice:

                        19000000,


                    laborPercent:

                        10,


                    profitPercent:

                        7,


                    taxPercent:

                        10

                },

                {}

            );



        expect(result.success)

            .toBe(false);



        expect(result.error)

            .toContain(

                "Weight must be greater than zero"

            );



    });






    it("should return failure when calculation fails", async () => {



        const useCase = {


            async execute() {


                throw new Error(

                    "calculation failed"

                );


            }


        } as any;




        const tool =

            new CalculateGoldPriceTool(

                useCase

            );



        const result =

            await tool.execute(

                {

                    weight:

                        2

                },

                {}

            );



        expect(result.success)

            .toBe(false);



        expect(result.error)

            .toContain(

                "calculation failed"

            );


    });



});