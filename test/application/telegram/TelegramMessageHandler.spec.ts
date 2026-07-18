import { describe, expect, it } from "vitest";
import { TelegramMessageHandler } from "../../../src/application/telegram/TelegramMessageHandler";


describe(
    "TelegramMessageHandler",
    ()=>{


        it(
            "should handle gold price command",
            async()=>{


                const handler =
                    new TelegramMessageHandler();



                const result =
                    await handler.handle(
                        "قیمت طلا"
                    );



                expect(result)
                    .toBe(
                        "قیمت طلا در حال دریافت است"
                    );


            }
        );



        it(
            "should reject unknown command",
            async()=>{


                const handler =
                    new TelegramMessageHandler();



                const result =
                    await handler.handle(
                        "hello"
                    );



                expect(result)
                    .toBe(
                        "دستور نامعتبر است"
                    );


            }
        );


    }
);