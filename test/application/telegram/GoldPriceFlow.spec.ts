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

import { GoldPriceMessageFormatter }
from "../../../src/application/telegram/presentation/GoldPriceMessageFormatter";

import { TelegramMessageBuilder }
from "../../../src/application/telegram/presentation/TelegramMessageBuilder";

import { TelegramDateFormatter }
from "../../../src/application/telegram/presentation/TelegramDateFormatter";

import { TelegramNumberFormatter }
from "../../../src/application/telegram/presentation/TelegramNumberFormatter";



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


        const goldPriceMessageFormatter =

            new GoldPriceMessageFormatter(

                new TelegramMessageBuilder(),

                new TelegramDateFormatter(),

                new TelegramNumberFormatter()

            );



            const router =

                TelegramCommandRegistry.create(
                useCase,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
                undefined as any,
            goldPriceMessageFormatter
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

                        "قیمت لحظه‌ای طلا"

                    );



                expect(result.content)

                    .toContain(

                        "طلای ۱۸ عیار"

                    );



                expect(result.content)

                    .toContain(

                        "۱۸٬۷۸۰٬۱۵۵"

                    );



                expect(result.content)

                    .toContain(

                        "۱۹۳٬۱۹۰"

                    );


            }
        );


    }
);








