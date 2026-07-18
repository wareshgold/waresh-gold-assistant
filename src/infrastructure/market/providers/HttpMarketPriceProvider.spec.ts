import { describe, expect, it } from "vitest";
import { HttpMarketPriceProvider } from "./HttpMarketPriceProvider";
import { FakePriceSourceClient } from "../clients/FakePriceSourceClient";


describe("HttpMarketPriceProvider",()=>{


    it("should convert source price to domain price", async()=>{


        const client =
            new FakePriceSourceClient();


        const provider =
            new HttpMarketPriceProvider(
                client
            );


        const result =
            await provider.getCurrentPrice();



        expect(result.gold18Price)
            .toBe(18350000);


        expect(result.currencyPrice)
            .toBe(188000);


    });


});