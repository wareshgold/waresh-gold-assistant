import {
    describe,
    expect,
    it
} from "vitest";


import {
    CalculateInvoiceTool
} from "./CalculateInvoiceTool";



describe(
    "CalculateInvoiceTool",
    () => {



        it(
            "should calculate invoice successfully",
            async () => {



                const useCase = {


                    execute(input: unknown) {


                        return {


                            input,


                            total:

                                50000000


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

                            items:

                            [

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

                                        10,


                                    discountPercent:

                                        0

                                }

                            ]

                        },

                        {

                            userId:

                                "user-1"

                        }

                    );





                expect(

                    result.success

                )

                    .toBe(true);





                expect(

                    result.data

                )

                    .toEqual({


                        input:

                        expect.any(Object),



                        total:

                            50000000


                    });



            }

        );







        it(
            "should return failure for invalid domain data",
            async () => {



                const useCase = {


                    execute() {


                        throw new Error(

                            "should not execute"

                        );


                    }


                } as any;





                const tool =

                    new CalculateInvoiceTool(

                        useCase

                    );





                const result =

                    await tool.execute(

                        {

                            items:

                            [

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

                                }

                            ]

                        },

                        {}

                    );





                expect(

                    result.success

                )

                    .toBe(false);



            }

        );



    }

);