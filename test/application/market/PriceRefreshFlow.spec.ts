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


import { MemoryMarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/MemoryMarketSnapshotRepository";


import { MarketSnapshotService }
from "../../../src/application/market/services/MarketSnapshotService";



describe(
    "Price Refresh Flow",
    ()=>{


        it(
            "should refresh price, cache it and create snapshot",
            async()=>{


                const cache =
                    new MemoryCacheStore();



                const snapshotRepository =
                    new MemoryMarketSnapshotRepository();



                const snapshotService =
                    new MarketSnapshotService(
                        snapshotRepository
                    );



                const telegramClient =
                    new TelegramPriceSourceClient(
                        () =>
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

                        cache,

                        snapshotService

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



                const snapshot =
                    await snapshotService.getLatest();



                expect(snapshot)
                    .not
                    .toBeNull();



                expect(
                    snapshot?.gold18Price
                )
                .toBe(
                    18780155
                );


            }
        );


    }
);