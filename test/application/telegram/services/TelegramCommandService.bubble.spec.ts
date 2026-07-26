import { describe, it, expect } from "vitest";


import { TelegramCommandService }
from "../../../../src/application/telegram/services/TelegramCommandService";


import { TelegramCommandRegistry }
from "../../../../src/application/telegram/commands/TelegramCommandRegistry";


import { GetGoldBubbleUseCase }
from "../../../../src/application/market/GetGoldBubbleUseCase";


import { GoldBubbleCalculator }
from "../../../../src/domain/market/services/GoldBubbleCalculator";


import { MarketPriceProvider }
from "../../../../src/domain/market/providers/MarketPriceProvider";


import { MarketPrice }
from "../../../../src/domain/market/entities/MarketPrice";


import { GetGoldPriceUseCase }
from "../../../../src/application/usecases/GetGoldPriceUseCase";





class FakeMarketPriceProvider

implements MarketPriceProvider {



    async getCurrentPrice(): Promise<MarketPrice> {


        return new MarketPrice(


            18_500_000,


            180_000,


            3_300,


            new Date()


        );


    }



}









describe(

    "Telegram Bubble Command Flow",

    () => {





        it(

            "should process /bubble command",

            async () => {





                const marketProvider =

                    new FakeMarketPriceProvider();







                const bubbleUseCase =

                    new GetGoldBubbleUseCase(

                        marketProvider,

                        new GoldBubbleCalculator()

                    );







                const fakeGoldPriceUseCase =

                    {} as GetGoldPriceUseCase;








                const router =

                    TelegramCommandRegistry.create(

                        fakeGoldPriceUseCase,

                        bubbleUseCase

                    );








                const service =

                    new TelegramCommandService(

                        router

                    );








                const response =

                    await service.execute(

                        "/bubble"

                    );








                expect(response.content)

                    .toContain(

                        "حباب طلا"

                    );








                expect(response.content)

                    .toContain(

                        "درصد حباب"

                    );





            }

        );





    }

);