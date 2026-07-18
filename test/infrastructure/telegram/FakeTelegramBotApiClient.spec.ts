import { describe,expect,it } from "vitest";
import { FakeTelegramBotApiClient } from "../../../src/infrastructure/telegram/clients/FakeTelegramBotApiClient";


describe(
    "FakeTelegramBotApiClient",
    ()=>{


        it(
            "should store sent messages",
            async()=>{


                const client =
                    new FakeTelegramBotApiClient();


                await client.sendMessage(
                    "123",
                    "قیمت طلا"
                );


                expect(
                    client.messages[0]
                )
                .toEqual({
                    chatId:"123",
                    text:"قیمت طلا"
                });


            }
        );


    }
);