import { describe, expect, it } from "vitest";
import { env } from "cloudflare:test";


import { RefreshMarketPriceUseCase }
from "../../../src/application/market/RefreshMarketPriceUseCase";


import { PriceRefreshService }
from "../../../src/application/market/services/PriceRefreshService";


import { MarketSnapshotService }
from "../../../src/application/market/services/MarketSnapshotService";


import { D1MarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/d1/D1MarketSnapshotRepository";


import { MockMarketPriceProvider }
from "../../../src/infrastructure/market/providers/MockMarketPriceProvider";


import { MemoryCacheStore }
from "../../../src/infrastructure/cache/MemoryCacheStore";



describe(
    "MarketRefreshFlow",
    ()=>{


        it(
            "should refresh price and persist snapshot in D1",
            async()=>{


                const repository =
                    new D1MarketSnapshotRepository(
                        env.waresh_gold_db
                    );



                const snapshotService =
                    new MarketSnapshotService(
                        repository
                    );



                const cache =
                    new MemoryCacheStore();



                const refreshService =
                    new PriceRefreshService(

                        new MockMarketPriceProvider(),

                        cache,

                        snapshotService

                    );



                const useCase =
                    new RefreshMarketPriceUseCase(

                        refreshService

                    );



                const price =
                    await useCase.execute();



                const snapshot =
                    await snapshotService.getLatest();



                expect(price.gold18Price)
                    .toBe(
                        18300000
                    );



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