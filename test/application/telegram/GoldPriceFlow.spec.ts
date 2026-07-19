import { describe, expect, it } from "vitest";


import { TelegramCommandService }
from "../../../src/application/telegram/services/TelegramCommandService";


import { TelegramCommandRegistry }
from "../../../src/application/telegram/commands/TelegramCommandRegistry";


import { GetGoldPriceUseCase }
from "../../../src/application/usecases/GetGoldPriceUseCase";


import { TelegramMarketPriceProvider }
from "../../../src/infrastructure/market/providers/TelegramMarketPriceProvider";


import { FakeTelegramChannelMessageProvider }
from "../../../src/infrastructure/market/sources/FakeTelegramChannelMessageProvider";



describe(
    "Gold Price Full Flow",
    ()=>{


        const createService = ()=>{


            const marketProvider =
                new TelegramMarketPriceProvider(
                    new FakeTelegramChannelMessageProvider()
                );



            const useCase =
                new GetGoldPriceUseCase(
                    marketProvider
                );



            const router =
                TelegramCommandRegistry.create(
                    useCase,
                    undefined as any
                );



            return new TelegramCommandService(
                router
            );


        };





        it(
            "should get gold price from telegram market source",
            async()=>{


                const service =
                    createService();



                const result =
                    await service.execute(
                        "/price"
                    );



                expect(result.content)
                    .toContain(
                        "18780155"
                    );



                expect(result.content)
                    .toContain(
                        "193190"
                    );


            }
        );


    }
);