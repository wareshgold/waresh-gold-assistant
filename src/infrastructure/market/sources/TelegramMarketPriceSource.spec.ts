import { afterEach, describe, expect, it, vi } from "vitest";

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



        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-28T08:00:00.000Z"));

        const messageProvider:
            MarketMessageProvider = {


                async getLatestMessage() {


                    return `

🔻طلای ۱۸ عیار: 18,306,478 تومان

دلار تهران: 187,790 تومان

انس طلا: 3350 دلار
ساعت: ۱۱:۰۰
تاریخ: ۱۴۰۵/۰۸/۰۶

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



    it("accepts a same-day fallback price after market hours", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-29T20:00:00.000Z"));

        try {
            const messageProvider: MarketMessageProvider = {
                async getLatestMessage() {
                    return `
▫️ دلار: ۲۷۰،۶۸۰ تومان
🔹 تتر: ۲۷۰،۸۴۷ تومان
🔹 انس طلا: ۴،۰۲۶.۹۳ دلار
🔻 طلای ۱۸ عیار: ۲۶،۱۸۶،۸۰۰ تومان
🕰️ ۷ آبان ۱۴۰۵ - ۱۵:۳۰
`;
                }
            };

            const source = new TelegramMarketPriceSource(
                messageProvider,
                12 * 60 * 60 * 1000
            );
            const result = await source.getPrice();
            expect(result.gold18Price).toBe(26186800);
        } finally {
            vi.useRealTimers();
        }
    });

});