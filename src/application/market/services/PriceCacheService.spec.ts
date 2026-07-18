import { describe, expect, it } from "vitest";
import { PriceCacheService } from "./PriceCacheService";
import { MemoryCacheStore } from "../../../infrastructure/cache/MemoryCacheStore";
import { MockMarketPriceProvider } from "../../../infrastructure/market/providers/MockMarketPriceProvider";


describe("PriceCacheService",()=>{


it("should cache market price", async()=>{


    const service =
        new PriceCacheService(
            new MockMarketPriceProvider(),
            new MemoryCacheStore()
        );


    const first =
        await service.getCurrentPrice();


    const second =
        await service.getCurrentPrice();


    expect(first.gold18Price)
        .toBe(18300000);


    expect(second.gold18Price)
        .toBe(18300000);


});


});