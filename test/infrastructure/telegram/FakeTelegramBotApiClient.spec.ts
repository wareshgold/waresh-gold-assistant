import { describe, expect, it } from "vitest";

import { FakeTelegramBotClient } from "../../../src/infrastructure/telegram/clients/FakeTelegramBotClient";


describe(
    "FakeTelegramBotClient",
    () => {


        it(
            "should store telegram messages",
            async () => {


                const client =
                    new FakeTelegramBotClient();



                await client.sendMessage({

                    chatId:
                        "123",

                    text:
                        "hello"

                });



                expect(
                    client.messages[0]
                )
                .toEqual({

                    chatId:
                        "123",

                    text:
                        "hello"

                });


            }
        );


    }
);