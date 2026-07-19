import { describe, expect, it } from "vitest";


import { PriceRefreshService }
from "../../../src/application/market/services/PriceRefreshService";


import { MemoryCacheStore }
from "../../../src/infrastructure/cache/MemoryCacheStore";


import { HttpMarketPriceProvider }
from "../../../src/infrastructure/market/providers/HttpMarketPriceProvider";


import { TelegramPriceSourceClient }
from "../../../src/infrastructure/market/clients/telegram/TelegramPriceSourceClient";


import { FakeTelegramChannelMessageProvider }
from "../../../src/infrastructure/market/sources/FakeTelegramChannelMessageProvider";



describe(
    "Price Refresh Flow",
    ()=>{


        it(
            "should refresh price and store it in cache",
            async()=>{


                const cache =
                    new MemoryCacheStore();



                const telegramClient =
                    new TelegramPriceSourceClient(
                        ()=> 
                            new FakeTelegramChannelMessageProvider()
                                .getLatestMessage()
                    );



                const provider =
                    new HttpMarketPriceProvider(
                        telegramClient
                    );



                const refreshService =
                    new PriceRefreshService(
                        provider,
                        cache
                    );



                const price =
                    await refreshService.refresh();



                expect(price.gold18Price)
                    .toBe(
                        18780155
                    );



                const cached =
                    await cache.get<any>(
                        "market:current-price"
                    );



                expect(cached)
                    .not
                    .toBeNull();



                expect(cached.gold18Price)
                    .toBe(
                        18780155
                    );


            }
        );


    }
);