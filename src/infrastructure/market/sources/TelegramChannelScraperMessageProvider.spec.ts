import { afterEach, describe, expect, it, vi } from "vitest";
import { TelegramChannelScraperMessageProvider } from "./TelegramChannelScraperMessageProvider";

describe("TelegramChannelScraperMessageProvider", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("extracts the latest valid Telegram price message", async () => {
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

        vi.stubGlobal("fetch", vi.fn(async () => ({
            ok: true,
            text: async () => telegramHtml
        })));

        const provider = new TelegramChannelScraperMessageProvider(
            "https://t.me/s/Qeymategold"
        );

        const result = await provider.getLatestMessage();

        expect(result).toContain("18,500,000");
        expect(result).toContain("188,000");
    });

    it("does not fall back to an older price when the newest gold post omits currency", async () => {
        const html = `
<div class="tgme_widget_message_text">طلای ۱۸ عیار: 25,000,000 تومان<br>دلار: 260,000 تومان<br>اونس طلا: 4,000$<br>ساعت: ۱۰:۰۰<br>تاریخ: ۱۴۰۵/۰۸/۰۶</div>
<div class="tgme_widget_message_text">طلای ۱۸ عیار: 26,000,000 تومان<br>اونس طلا: 4,050$<br>ساعت: ۱۱:۰۰<br>تاریخ: ۱۴۰۵/۰۸/۰۶</div>
`;

        vi.stubGlobal("fetch", vi.fn(async () => ({
            ok: true,
            text: async () => html
        })));

        const provider = new TelegramChannelScraperMessageProvider(
            "https://t.me/s/ecogold_ir"
        );

        await expect(provider.getLatestMessage()).rejects.toThrow(
            "Latest Telegram gold-price message has no dollar/tether price"
        );
    });
});
