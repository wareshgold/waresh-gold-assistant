import { describe, expect, it } from "vitest";

import {
    CalculateInvoiceTool
} from "./CalculateInvoiceTool";



describe("CalculateInvoiceTool", () => {



    it("should calculate invoice successfully", async () => {



        const useCase = {


            async execute(input: unknown) {


                return {


                    input,


                    total:

                        75000000,


                    tax:

                        5000000

                };


            }


        } as any;





        const tool =

            new CalculateInvoiceTool(

                useCase

            );





        const result =

            await tool.execute(

                {

                    weight:

                        3,


                    labor:

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

                        3,


                    labor:

                        10

                },


                total:

                    75000000,


                tax:

                    5000000

            });



    });







    it("should return failure when invoice calculation fails", async () => {



        const useCase = {


            async execute() {


                throw new Error(

                    "invoice calculation failed"

                );


            }


        } as any;





        const tool =

            new CalculateInvoiceTool(

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

                "invoice calculation failed"

            );



    });



});