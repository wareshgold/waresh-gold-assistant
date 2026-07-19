import { describe, expect, it } from "vitest";


import { PriceRefreshService }
from "./PriceRefreshService";


import { MemoryCacheStore }
from "../../../infrastructure/cache/MemoryCacheStore";


import { MockMarketPriceProvider }
from "../../../infrastructure/market/providers/MockMarketPriceProvider";


import { MemoryMarketSnapshotRepository }
from "../../../infrastructure/market/repositories/MemoryMarketSnapshotRepository";


import { MarketSnapshotService }
from "./MarketSnapshotService";



describe(
    "PriceRefreshService",
    ()=>{


        it(
            "should refresh, cache and save snapshot",
            async()=>{


                const cache =
                    new MemoryCacheStore();



                const snapshotRepository =
                    new MemoryMarketSnapshotRepository();



                const snapshotService =
                    new MarketSnapshotService(
                        snapshotRepository
                    );



                const service =
                    new PriceRefreshService(

                        new MockMarketPriceProvider(),

                        cache,

                        snapshotService

                    );



                const price =
                    await service.refresh();



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



                expect(
                    snapshot?.gold18Price
                )
                .toBe(
                    18300000
                );


            }
        );


    }
);