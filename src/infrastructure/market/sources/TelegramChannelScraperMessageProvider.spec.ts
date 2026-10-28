import { describe, expect, it, vi } from "vitest";

import {
    TelegramChannelScraperMessageProvider
}
from "./TelegramChannelScraperMessageProvider";

import { TelegramPriceParser } from "../parsers/TelegramPriceParser";



describe("TelegramChannelScraperMessageProvider", () => {



    it("should extract latest telegram channel message from html", async () => {



        const telegramHtml = `

        <div class="tgme_widget_message_text">
            🔻طلای ۱۸ عیار: 18,306,478 تومان<br/>
            دلار تهران: 187,790 تومان<br/>
            انس طلا: 3350 دلار
        </div>


        <div class="tgme_widget_message_text">
            🔻طلای ۱۸ عیار: 18,500,000 تومان<br/>
            دلار تهران: 188,000 تومان<br/>
            انس طلا: 3360 دلار
        </div>

        `;



        vi.stubGlobal(

            "fetch",

            vi.fn(async () => ({

                ok: true,

                text:
                    async () => telegramHtml


            }))

        );



        const provider =

            new TelegramChannelScraperMessageProvider(

                "https://t.me/s/Qeymategold"

            );



        const result =

            await provider.getLatestMessage();



        expect(result)
            .toContain(
                "18,500,000"
            );


        expect(result)
            .toContain(
                "188,000"
            );


    });

    it("should accept TomanNama dashboard-style gold and dollar prices", async () => {
        const telegramHtml = `
        <div class="tgme_widget_message_text">
            📌 در یک نگاه<br/>
            🇺🇸 دلار آمریکا<br/>
            تومان / واحد<br/>
            269,835<br/>
            ✨ طلای ۱۸ عیار<br/>
            تومان / گرم طلای ۱۸ عیار<br/>
            26,339,789<br/>
            🪙 سکه امامی<br/>
            تومان / قطعه<br/>
            267,394,000<br/>
            🕒 UTC · 2026-10-28T08:55:20Z
        </div>
        `;

        vi.stubGlobal(
            "fetch",
            vi.fn(async () => ({
                ok: true,
                text: async () => telegramHtml
            }))
        );

        const provider = new TelegramChannelScraperMessageProvider(
            "https://t.me/s/TomanNama"
        );

        const result = await provider.getLatestMessage();

        expect(result).toContain("269,835");
        expect(result).toContain("26,339,789");

        const parsed = TelegramPriceParser.parse(result);
        expect(parsed.gold18Price).toBe(26_339_789);
        expect(parsed.currencyPrice).toBe(269_835);
        expect(parsed.updatedAt.toISOString()).toBe("2026-10-28T08:55:20.000Z");
    });





});