import { describe, expect, it } from "vitest";


import { GetGoldBubbleCommandHandler }
from "../../../../../src/application/telegram/commands/handlers/GetGoldBubbleCommandHandler";


import { GetGoldBubbleUseCase }
from "../../../../../src/application/market/GetGoldBubbleUseCase";





describe(
    "GetGoldBubbleCommandHandler",
    () => {





        class FakeGetGoldBubbleUseCase

        implements Pick<GetGoldBubbleUseCase, "execute"> {





            async execute() {


                return {


                    type:

                        "data",



                    content:

                        "",




                    data: {


                        marketPrice:

                            18500000,


                        intrinsicPrice:

                            14324759,


                        bubbleAmount:

                            4175241,


                        bubblePercentage:

                            29.15


                    },





                    metadata: {


                        marketPrice:

                            18500000,


                        intrinsicPrice:

                            14324759,


                        bubbleAmount:

                            4175241,


                        bubblePercentage:

                            29.15


                    }


                };


            }



        }









        const createHandler = () => {


            return new GetGoldBubbleCommandHandler(

                new FakeGetGoldBubbleUseCase()

            );


        };









        it(
            "should handle /bubble command",
            () => {


                const handler =

                    createHandler();




                expect(

                    handler.canHandle("/bubble")

                )

                .toBe(true);



            }
        );









        it(
            "should handle Persian bubble commands",
            () => {


                const handler =

                    createHandler();




                expect(

                    handler.canHandle("حباب")

                )

                .toBe(true);





                expect(

                    handler.canHandle("حباب طلا")

                )

                .toBe(true);



            }
        );









        it(
            "should return bubble response",
            async () => {



                const handler =

                    createHandler();





                const result =

                    await handler.execute(

                        {} as any

                    );






                expect(

                    result.content

                )

                .toContain(

                    "حباب طلا"

                );



            }
        );




    }
);