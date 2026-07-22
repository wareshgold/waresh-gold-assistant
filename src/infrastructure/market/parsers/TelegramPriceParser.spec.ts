import { describe, expect, it } from "vitest";

import {
    TelegramPriceParser
}
from "./TelegramPriceParser";



describe("TelegramPriceParser", () => {



    it("should parse market values and telegram timestamp", () => {



        const message = `

🔻طلای ۱۸ عیار: 18,306,478 تومان

دلار تهران: 187,790 تومان

اونس طلا: 3350 دلار

تاریخ: ۱۴۰۵/۰۴/۳۱

ساعت: ۱۵:۳۰

`;



        const result =

            TelegramPriceParser.parse(
                message
            );



        expect(result.gold18Price)
            .toBe(18306478);



        expect(result.currencyPrice)
            .toBe(187790);



        expect(result.ouncePrice)
            .toBe(3350);



        expect(result.updatedAt)
            .toBeInstanceOf(Date);



        expect(result.updatedAt.getUTCHours())
            .toBe(15);



        expect(result.updatedAt.getUTCMinutes())
            .toBe(30);



    });



});