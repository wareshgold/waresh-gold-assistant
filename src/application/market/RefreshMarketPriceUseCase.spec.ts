import { describe, expect, it } from "vitest";


import { RefreshMarketPriceUseCase }
from "./RefreshMarketPriceUseCase";


import { PriceRefreshService }
from "./services/PriceRefreshService";


import { MemoryCacheStore }
from "../../infrastructure/cache/MemoryCacheStore";


import { MockMarketPriceProvider }
from "../../infrastructure/market/providers/MockMarketPriceProvider";


import { MemoryMarketSnapshotRepository }
from "../../infrastructure/market/repositories/MemoryMarketSnapshotRepository";


import { MarketSnapshotService }
from "./services/MarketSnapshotService";



describe(
    "RefreshMarketPriceUseCase",
    ()=>{


        it(
            "should refresh market price, cache it and save snapshot",
            async()=>{


                const cache =
                    new MemoryCacheStore();



                const snapshotRepository =
                    new MemoryMarketSnapshotRepository();



                const snapshotService =
                    new MarketSnapshotService(
                        snapshotRepository
                    );



                const priceRefreshService =

                    new PriceRefreshService(

                        new MockMarketPriceProvider(),

                        cache,

                        snapshotService

                    );



                const useCase =

                    new RefreshMarketPriceUseCase(

                        priceRefreshService

                    );



                const price =
                    await useCase.execute();



                const cached =
                    await cache.get(
                        "market:current-price"
                    );



                const snapshot =
                    await snapshotService.getLatest();





                expect(price.gold18Price)
                    .toBe(
                        18300000
                    );



                expect(cached)
                    .not
                    .toBeNull();





                expect(snapshot)
                    .not
                    .toBeNull();



                expect(snapshot?.gold18Price)
                    .toBe(
                        18300000
                    );


            }
        );


    }
);