import { describe, expect, it } from "vitest";

import { createContainer }
from "../../src/bootstrap/createContainer";



describe(
    "ApplicationContainer integration",
    () => {


        it(
            "should process gold price message flow",
            async () => {


                const fakeEnv: any = {

                    ENVIRONMENT:
                        "test",


                    MARKET_CACHE:
                        {
                            get: async () => null,
                            put: async () => {}
                        },


                    waresh_gold_db:
                        undefined,


                    MARKET_PRICE_API_URL:
                        "http://localhost:3000",


                    TELEGRAM_BOT_TOKEN:
                        undefined,


                    TELEGRAM_WEBHOOK_SECRET:
                        "test-secret"

                };



                const container =
                    createContainer(
                        fakeEnv
                    );



                const result =
                    await container
                        .telegramMessageHandler
                        .handle({

                            userId: "1",

                            text: "قیمت طلا"

                        });



                expect(result)
                    .toContain(
                        "قیمت"
                    );


            }
        );


    }
);