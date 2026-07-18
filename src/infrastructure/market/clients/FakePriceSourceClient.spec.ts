import { describe, expect, it } from "vitest";
import { FakePriceSourceClient } from "./FakePriceSourceClient";


describe("FakePriceSourceClient",()=>{


    it("should fetch raw market price", async()=>{


        const client =
            new FakePriceSourceClient();


        const result =
            await client.fetchPrice();


        expect(result.gold18Price)
            .toBe(18350000);


        expect(result.currencyPrice)
            .toBe(188000);


    });


});