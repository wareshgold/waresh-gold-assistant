import { describe, expect, it } from "vitest";

import {
    HttpMarketPriceSource
}
from "./HttpMarketPriceSource";

import {
    FakePriceSourceClient
}
from "../clients/FakePriceSourceClient";



describe("HttpMarketPriceSource", () => {



    it("should convert http client price to market source result", async () => {



        const source =
            new HttpMarketPriceSource(

                new FakePriceSourceClient()

            );



        const result =
            await source.getPrice();



        expect(result.gold18Price)
            .toBe(18350000);



        expect(result.currencyPrice)
            .toBe(188000);


    });



});