import { describe, expect, it, vi } from "vitest";

import {
    TelegramChannelScraperMessageProvider
}
from "./TelegramChannelScraperMessageProvider";



describe("TelegramChannelScraperMessageProvider", () => {



    it("should extract latest telegram channel message from html", async () => {



        const telegramHtml = `

        <div class="tgme_widget_message_text">
            🔻طلای ۱۸ عیار: 18,306,478 تومان<br/>
            دلار تهران: 187,790 تومان<br/>
            اونس طلا: 3350 دلار
        </div>


        <div class="tgme_widget_message_text">
            🔻طلای ۱۸ عیار: 18,500,000 تومان<br/>
            دلار تهران: 188,000 تومان<br/>
            اونس طلا: 3360 دلار
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



});