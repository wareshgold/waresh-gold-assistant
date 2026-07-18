import { describe, expect, it } from "vitest";
import { MockMarketPriceProvider } from "./MockMarketPriceProvider";


describe("MockMarketPriceProvider", () => {

    it("should return market price", async () => {

        const provider =
            new MockMarketPriceProvider();


        const result =
            await provider.getCurrentPrice();


        expect(result.gold18Price)
            .toBe(18300000);


        expect(result.currencyPrice)
            .toBe(187000);


        expect(result.updatedAt)
            .toBeInstanceOf(Date);

    });

});