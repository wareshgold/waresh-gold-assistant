import {
    describe,
    expect,
    it
}
from "vitest";


import {
    GetCurrentGoldMithqalPriceTool
}
from "./GetCurrentGoldMithqalPriceTool";



describe(

    "GetCurrentGoldMithqalPriceTool",

    () => {


        it(

            "should convert gram gold price to mithqal price",

            async () => {


                const useCase = {


                    async execute() {


                        return {


                            price:

                                19124000


                        };


                    }


                } as any;





                const tool =

                    new GetCurrentGoldMithqalPriceTool(

                        useCase

                    );





                const result =

                    await tool.execute(

                        {},

                        {}

                    );





                expect(

                    result.success

                )

                .toBe(true);





                expect(

                    result.data

                )

                .toEqual({

                    pricePerGram18k:

                        19124000,


                    mithqal:

                        4.608,


                    mithqalPrice:

                        88123392

                });



            }

        );


    }

);