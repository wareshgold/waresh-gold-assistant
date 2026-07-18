import { describe, expect, it } from "vitest";

import { TelegramUpdateProcessor } from "../../../src/application/telegram/services/TelegramUpdateProcessor";
import { TelegramUpdateMapper } from "../../../src/infrastructure/telegram/TelegramUpdateMapper";
import { TelegramResponseFormatter } from "../../../src/application/telegram/TelegramResponseFormatter";
import { TelegramMessageHandler } from "../../../src/application/telegram/TelegramMessageHandler";
import { FakeTelegramBotApiClient } from "../../../src/infrastructure/telegram/clients/FakeTelegramBotApiClient";


describe(
    "TelegramUpdateProcessor",
    ()=>{


        it(
            "should process telegram update flow",
            async()=>{


                const botClient =
                    new FakeTelegramBotApiClient();


                const commandService = {

                    async execute(){

                        return {

                            content:"قیمت طلا آماده است"

                        };

                    }

                };


                const handler =
                    new TelegramMessageHandler(
                        commandService as any,
                        new TelegramResponseFormatter()
                    );


                const processor =
                    new TelegramUpdateProcessor(

                        new TelegramUpdateMapper(),

                        handler,

                        new TelegramResponseFormatter(),

                        botClient

                    );


                await processor.process({

                    update_id:1,

                    message:{

                        from:{
                            id:456
                        },

                        text:"قیمت طلا"

                    }

                });


                expect(
                    botClient.messages[0]
                )
                .toEqual({

                    chatId:"456",

                    text:"قیمت طلا آماده است"

                });


            }
        );


    }
);