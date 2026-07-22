import { describe, expect, it } from "vitest";

import {
    ResilientMarketPriceProvider
}
from "./ResilientMarketPriceProvider";


import {
    MemoryCacheStore
}
from "../../cache/MemoryCacheStore";


import {
    MarketPriceProvider
}
from "../../../domain/market/providers/MarketPriceProvider";


import {
    MarketPrice
}
from "../../../domain/market/entities/MarketPrice";



describe("ResilientMarketPriceProvider", () => {



    it("should return fresh price and save last known price", async () => {



        const cache =
            new MemoryCacheStore();



        const provider:
            MarketPriceProvider = {


                async getCurrentPrice() {


                    return new MarketPrice(

                        18000000,

                        190000,

                        4000,

                        new Date()

                    );

                }


            };



        const resilient =
            new ResilientMarketPriceProvider(

                provider,

                cache

            );



        const result =
            await resilient.getCurrentPrice();



        expect(result.gold18Price)
            .toBe(18000000);



        const cached =
            await cache.get<MarketPrice>(
                "market:last-known-price"
            );



        expect(cached?.gold18Price)
            .toBe(18000000);


    });





    it("should return last known price when provider fails", async () => {



        const cache =
            new MemoryCacheStore();



        await cache.set(

            "market:last-known-price",

            new MarketPrice(

                17500000,

                185000,

                3900,

                new Date()

            )

        );



        const provider:
            MarketPriceProvider = {


                async getCurrentPrice() {

                    throw new Error(
                        "source failed"
                    );

                }


            };



        const resilient =
            new ResilientMarketPriceProvider(

                provider,

                cache

            );



        const result =
            await resilient.getCurrentPrice();



        expect(result.gold18Price)
            .toBe(17500000);


    });





});