import { describe, expect, it } from "vitest";
import { PriceRefreshService } from "./PriceRefreshService";
import { MemoryCacheStore } from "../../../infrastructure/cache/MemoryCacheStore";
import { MockMarketPriceProvider } from "../../../infrastructure/market/providers/MockMarketPriceProvider";


describe(
    "PriceRefreshService",
    ()=>{


    it(
        "should refresh and cache price",
        async()=>{


            const cache =
                new MemoryCacheStore();


            const service =
                new PriceRefreshService(
                    new MockMarketPriceProvider(),
                    cache
                );



            const price =
                await service.refresh();



            const cached =
                await cache.get(
                    "market:current-price"
                );



            expect(price.gold18Price)
                .toBe(18300000);



            expect(cached)
                .not
                .toBeNull();


        }
    );


});