import { describe, expect, it } from "vitest";
import { ApplicationContainer } from "../../src/container/ApplicationContainer";


describe(
    "ApplicationContainer integration",
    () => {


        it(
            "should process gold price message flow",
            async () => {


                const container =
                    new ApplicationContainer();



                const result =
                    await container.telegramMessageHandler.handle({

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