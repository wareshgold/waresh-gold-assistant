import { describe, expect, it } from "vitest";

import { TelegramMessageHandler } 
from "../../../src/application/telegram/TelegramMessageHandler";

import { TelegramCommandService } 
from "../../../src/application/telegram/services/TelegramCommandService";

import { TelegramResponseFormatter } 
from "../../../src/application/telegram/TelegramResponseFormatter";

import { TelegramCommandRegistry } 
from "../../../src/application/telegram/commands/TelegramCommandRegistry";

import { GetGoldPriceUseCase } 
from "../../../src/application/usecases/GetGoldPriceUseCase";

import { FakePriceSourceClient } 
from "../../../src/infrastructure/market/clients/FakePriceSourceClient";


describe(
    "TelegramMessageHandler",
    ()=>{


        const createHandler = ()=>{


            const useCase =
                new GetGoldPriceUseCase(
                    new FakePriceSourceClient()
                );


            const router =
                TelegramCommandRegistry.create(
                    useCase
                );


            return new TelegramMessageHandler(

                new TelegramCommandService(
                    router
                ),

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