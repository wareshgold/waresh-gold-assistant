import { describe, expect, it } from "vitest";
import { TelegramPriceParser } from "./TelegramPriceParser";

describe("TelegramPriceParser", () => {
    it("parses Ecogold price posts with the existing date format", () => {
        const price = TelegramPriceParser.parse(`
🔻طلای ۱۸ عیار: 26,384,000 تومان
🔺دلار تهران: 269,500 تومان
🔺اونس طلا: 4,036$
ساعت: ۱۱:۰۲
تاریخ: ۱۴۰۵/۰۸/۰۶
`);

        expect(price.gold18Price).toBe(26384000);
        expect(price.currencyPrice).toBe(269500);
        expect(price.ouncePrice).toBe(4036);
        expect(price.updatedAt.toISOString()).toBe("2026-10-28T07:32:00.000Z");
    });

    it("parses the fallback source format, including Persian separators and decimal ounce prices", () => {
        const price = TelegramPriceParser.parse(`
🔻 دلار: ۲۶۸،۵۰۰ تومان
🔻 انس طلا: ۴،۰۴۷.۶۹ دلار
▫️ طلای ۱۸ عیار: ۲۶،۳۷۸،۲۰۰ تومان
🕰️ ۶ آبان ۱۴۰۵ - ۱۸:۰۱
`);

        expect(price.gold18Price).toBe(26378200);
        expect(price.currencyPrice).toBe(268500);
        expect(price.ouncePrice).toBe(4047.69);
        expect(price.updatedAt.toISOString()).toBe("2026-10-28T14:31:00.000Z");
    });

    it("rejects price posts without a timestamp instead of marking them as current", () => {
        expect(() => TelegramPriceParser.parse(`
🔻 طلای ۱۸ عیار: ۲۶،۳۸۴،۰۰۰ تومان
🔺 دلار تهران: ۲۶۹،۵۰۰ تومان
🔺 اونس طلا: ۴،۰۳۶ دلار
`)).toThrow("timestamp is required");
    });

    it("rejects Ecogold posts that no longer contain a currency price", () => {
        expect(() => TelegramPriceParser.parse(`
🔻طلای ۱۸ عیار: 26,384,000 تومان
🔺اونس طلا: 4,036$
ساعت: ۱۱:۰۲
تاریخ: ۱۴۰۵/۰۸/۰۶
`)).toThrow("gold and currency prices are required");
    });
});
