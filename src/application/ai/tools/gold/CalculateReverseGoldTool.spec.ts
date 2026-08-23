import {
    describe,
    expect,
    it
} from "vitest";

import {
    CalculateReverseGoldTool
} from "./CalculateReverseGoldTool";



describe("CalculateReverseGoldTool", () => {



    it("should reverse calculate labor successfully with provided gold price", async () => {



        const useCase = {


            execute(input: unknown) {


                return {


                    laborPercent:
                        12.5,


                    laborAmount:
                        1500000,


                    input

                };


            }


        } as any;



        const getCurrentGoldPriceUseCase = {


            async execute() {


                return {

                    price:
                        19711000

                };


            }


        } as any;



        const tool =

            new CalculateReverseGoldTool(

                useCase,

                getCurrentGoldPriceUseCase

            );





        const result =

            await tool.execute(

                {

                    target:
                        "LABOR_PERCENT",


                    finalPrice:
                        110000000,


                    weight:
                        5,


                    goldPrice:
                        19711000,


                    profitPercent:
                        0,


                    taxPercent:
                        0

                },

                {

                    userId:
                        "user-1"

                }

            );





        expect(result.success)

            .toBe(true);





        expect(result.data)

            .toMatchObject({

                laborPercent:
                    12.5,


                laborAmount:
                    1500000,


                target:
                    "LABOR_PERCENT",


                finalPrice:
                    110000000,


                weight:
                    5,


                goldPrice:
                    19711000

            });



    });





    it("should resolve current gold price when goldPrice is missing", async () => {



        const useCase = {


            execute(input: any) {


                return {


                    laborPercent:
                        10,


                    laborAmount:
                        1000000,


                    resolvedGoldPrice:
                        input.goldPrice

                };


            }


        } as any;



        const getCurrentGoldPriceUseCase = {


            async execute() {


                return {

                    price:
                        19711000

                };


            }


        } as any;



        const tool =

            new CalculateReverseGoldTool(

                useCase,

                getCurrentGoldPriceUseCase

            );





        const result =

            await tool.execute(

                {

                    target:
                        "LABOR_PERCENT",


                    finalPrice:
                        110000000,


                    weight:
                        5

                },

                {

                    userId:
                        "user-1"

                }

            );





        expect(result.success)

            .toBe(true);





        expect(result.data)

            .toMatchObject({

                laborPercent:
                    10,


                goldPrice:
                    19711000

            });



    });





    it("should return failure when reverse calculation fails", async () => {



        const useCase = {


            execute() {


                throw new Error(

                    "reverse calculation failed"

                );


            }


        } as any;



        const getCurrentGoldPriceUseCase = {


            async execute() {


                return {

                    price:
                        19711000

                };


            }


        } as any;



        const tool =

            new CalculateReverseGoldTool(

                useCase,

                getCurrentGoldPriceUseCase

            );





        const result =

            await tool.execute(

                {

                    target:
                        "LABOR_PERCENT",


                    finalPrice:
                        110000000,


                    weight:
                        5,


                    goldPrice:
                        19711000

                },

                {}

            );





        expect(result.success)

            .toBe(false);





        expect(result.error)

            .toContain(

                "reverse calculation failed"

            );



    });





    it("should return failure when schema validation fails", async () => {



        const useCase = {


            execute() {


                return {};


            }


        } as any;



        const getCurrentGoldPriceUseCase = {


            async execute() {


                return {

                    price:
                        19711000

                };


            }


        } as any;



        const tool =

            new CalculateReverseGoldTool(

                useCase,

                getCurrentGoldPriceUseCase

            );





        const result =

            await tool.execute(

                {},

                {}

            );





        expect(result.success)

            .toBe(false);





        expect(result.error)

            .toBeTruthy();



    });



});