import { describe, expect, it } from "vitest";

import {
    GetCurrentGoldPriceTool
} from "./GetCurrentGoldPriceTool";



describe("GetCurrentGoldPriceTool", () => {



    it("should return current gold price successfully", async () => {


        const useCase = {


            async execute() {


                return {

                    price:

                        19215328

                };


            }


        } as any;



        const tool =

            new GetCurrentGoldPriceTool(

                useCase

            );



        const result =

            await tool.execute(

                {},

                {

                    userId:

                        "user-1"

                }

            );



        expect(result.success)

            .toBe(true);



        expect(result.data)

            .toEqual({

                type:

                    "CURRENT_GOLD_PRICE",


                purity:

                    18,


                price:

                    19215328,


                currency:

                    "TOMAN",


                source:

                    "MARKET"

            });


    });





    it("should return failure when use case fails", async () => {



        const useCase = {


            async execute() {


                throw new Error(

                    "market unavailable"

                );


            }


        } as any;




        const tool =

            new GetCurrentGoldPriceTool(

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

                "market unavailable"

            );



    });



});