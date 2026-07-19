import { describe, expect, it } from "vitest";

import { TelegramCommandService } 
from "../../../../src/application/telegram/services/TelegramCommandService";

import { TelegramCommandRegistry } 
from "../../../../src/application/telegram/commands/TelegramCommandRegistry";

import { GetGoldPriceUseCase } 
from "../../../../src/application/usecases/GetGoldPriceUseCase";

import { FakePriceSourceClient } 
from "../../../../src/infrastructure/market/clients/FakePriceSourceClient";


describe(
    "TelegramCommandService",
    ()=>{


        const createService = ()=>{


            const useCase =
                new GetGoldPriceUseCase(
                    new FakePriceSourceClient()
                );


            const router =
                TelegramCommandRegistry.create(
                    useCase
                );


            return new TelegramCommandService(
                router
            );

        };



        it(
            "should handle start command",
            async()=>{


                const service =
                    createService();


                const result =
                    await service.execute(
                        "/start"
                    );


                expect(result.content)
                    .toContain(
                        "وارش گلد"
                    );


            }
        );



        it(
            "should handle help command",
            async()=>{


                const service =
                    createService();


                const result =
                    await service.execute(
                        "/help"
                    );


                expect(result.content)
                    .toContain(
                        "/price"
                    );


            }
        );



    }
);