import { describe, expect, it } from "vitest";
import { MarketPriceMapper } from "./MarketPriceMapper";


describe("MarketPriceMapper",()=>{


    it("should map raw price to domain entity",()=>{


        const raw = {

            gold18Price: 18306478,

            currencyPrice: 187790,

            ouncePrice: 3350,

            updatedAt: new Date()

        };


        const result =
            MarketPriceMapper.toDomain(raw);



        expect(result.gold18Price)
            .toBe(18306478);



        expect(result.currencyPrice)
            .toBe(187790);


    });


});