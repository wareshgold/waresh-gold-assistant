import { describe, expect, it } from "vitest";


import { GetMarketAnalyticsCommandHandler }
from "../../../../../src/application/telegram/commands/handlers/GetMarketAnalyticsCommandHandler";


import { GetMarketAnalyticsUseCase }
from "../../../../../src/application/market/GetMarketAnalyticsUseCase";


describe(
    "GetMarketAnalyticsCommandHandler",
    () => {



        class FakeGetMarketAnalyticsUseCase
        implements Pick<GetMarketAnalyticsUseCase, "execute"> {


            async execute() {

                return {


                    analytics: {

                        getCurrentPrice() {

                            return 18780155;

                        },


                        getChange() {

                            return {

                                formatted:
                                    "+2.50%"

                            };

                        },


                        getTrend() {

                            return {

                                emoji:
                                    "📈"

                            };

                        },


                        getVolatility() {

                            return 1.25;

                        }


                    }


                };

            }


        }





        const createHandler = () => {


            return new GetMarketAnalyticsCommandHandler(

                new FakeGetMarketAnalyticsUseCase()

            );


        };






        it(
            "should handle /analytics command",
            () => {


                const handler =
                    createHandler();



                expect(

                    handler.canHandle(
                        "/analytics"
                    )

                )
                .toBe(true);



            }
        );






        it(
            "should handle Persian analytics commands",
            () => {


                const handler =
                    createHandler();



                expect(

                    handler.canHandle(
                        "تحلیل"
                    )

                )
                .toBe(true);




                expect(

                    handler.canHandle(
                        "تحلیل بازار"
                    )

                )
                .toBe(true);



            }
        );







        it(
            "should return analytics response",
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
                    "تحلیل بازار طلا"
                );




                expect(

                    result.content

                )
                .toContain(
                    "📈"
                );



            }
        );



    }
);