import { describe, expect, it } from "vitest";

import {
    TelegramMarketPriceSource
}
from "./TelegramMarketPriceSource";

import {
    MarketMessageProvider
}
from "./MarketMessageProvider";



describe("TelegramMarketPriceSource", () => {



    it("should parse telegram market message to source result", async () => {



        const messageProvider:
            MarketMessageProvider = {


                async getLatestMessage() {


                    return `

🔻طلای ۱۸ عیار: 18,306,478 تومان

دلار تهران: 187,790 تومان

انس طلا: 3350 دلار

                    `;


                }


            };



        const source =
            new TelegramMarketPriceSource(
                messageProvider
            );



        const result =
            await source.getPrice();



        expect(result.gold18Price)
            .toBe(18306478);



        expect(result.currencyPrice)
            .toBe(187790);



        expect(result.ouncePrice)
            .toBe(3350);



    });



});