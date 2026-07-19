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


            execute() {

                return {

                    type: "text",

                    content:
                        "🟡 حباب طلا",

                    metadata: {

                        bubblePercentage: 5

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