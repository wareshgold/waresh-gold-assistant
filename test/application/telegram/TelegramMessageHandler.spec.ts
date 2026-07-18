import { describe, expect, it } from "vitest";
import { TelegramMessageHandler } from "../../../src/application/telegram/TelegramMessageHandler";
import { TelegramCommandService } from "../../../src/application/telegram/services/TelegramCommandService";
import { TelegramResponseFormatter } from "../../../src/application/telegram/TelegramResponseFormatter";


describe(
    "TelegramMessageHandler",
    ()=>{


        const createHandler = ()=>{

            return new TelegramMessageHandler(
                new TelegramCommandService(),
                new TelegramResponseFormatter()
            );

        };


        it(
            "should handle gold price command",
            async()=>{


                const handler =
                    createHandler();


                const result =
                    await handler.handle({

                        userId:"1",
                        text:"قیمت طلا"

                    });



                expect(result)
                    .toContain(
                        "قیمت"
                    );


            }
        );



        it(
            "should reject unknown command",
            async()=>{


                const handler =
                    createHandler();


                const result =
                    await handler.handle({

                        userId:"1",
                        text:"hello"

                    });



                expect(result)
                    .toContain(
                        "نامعتبر"
                    );


            }
        );


    }
);