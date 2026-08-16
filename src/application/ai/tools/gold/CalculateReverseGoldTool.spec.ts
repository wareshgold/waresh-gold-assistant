import { describe, expect, it } from "vitest";

import {
    CalculateReverseGoldTool
} from "./CalculateReverseGoldTool";



describe("CalculateReverseGoldTool", () => {



    it("should reverse calculate gold successfully", async () => {



        const useCase = {


            async execute(input: unknown) {


                return {


                    input,


                    weight:

                        2

                };


            }


        } as any;




        const tool =

            new CalculateReverseGoldTool(

                useCase

            );





        const result =

            await tool.execute(

                {

                    total:

                        50000000

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

                    total:

                        50000000

                },


                weight:

                    2

            });



    });






    it("should return failure when reverse calculation fails", async () => {



        const useCase = {


            async execute() {


                throw new Error(

                    "reverse calculation failed"

                );


            }


        } as any;





        const tool =

            new CalculateReverseGoldTool(

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

                "reverse calculation failed"

            );



    });



});