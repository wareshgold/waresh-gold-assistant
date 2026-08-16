import { describe, expect, it } from "vitest";

import {
    CalculateGoldPriceTool
} from "./CalculateGoldPriceTool";



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



        const result =

            await tool.execute(

                {

                    weight:

                        2

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

                        2

                },


                total:

                    25000000

            });



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

                {},

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