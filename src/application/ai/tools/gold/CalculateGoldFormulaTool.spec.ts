import { describe, expect, it } from "vitest";

import {
    CalculateGoldFormulaTool
} from "./CalculateGoldFormulaTool";



describe("CalculateGoldFormulaTool", () => {



    it("should calculate formula successfully", async () => {



        const useCase = {


            async execute(input: unknown) {


                return {


                    input,


                    result:

                        18000000

                };


            }


        } as any;





        const tool =

            new CalculateGoldFormulaTool(

                useCase

            );





        const result =

            await tool.execute(

                {

                    formula:

                        "gold_price * weight"

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

                    formula:

                        "gold_price * weight"

                },


                result:

                    18000000

            });



    });






    it("should return failure when formula calculation fails", async () => {



        const useCase = {


            async execute() {


                throw new Error(

                    "formula calculation failed"

                );


            }


        } as any;





        const tool =

            new CalculateGoldFormulaTool(

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

                "formula calculation failed"

            );



    });



});