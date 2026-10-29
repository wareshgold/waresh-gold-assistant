import { afterEach, describe, expect, it, vi } from "vitest";
import { TelegramChannelScraperMessageProvider } from "./TelegramChannelScraperMessageProvider";
import { TelegramPriceParser } from "../parsers/TelegramPriceParser";

describe("TelegramChannelScraperMessageProvider", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("extracts the latest valid Telegram price message", async () => {
        const telegramHtml = `
<div class="tgme_widget_message_text">
    🔻طلای ۱۸ عیار: 18,306,478 تومان<br/>
    دلار تهران: 187,790 تومان<br/>
    انس طلا: 3350 دلار<br/>
    ساعت: ۱۰:۰۰<br/>
    تاریخ: ۱۴۰۵/۰۸/۰۶
</div>
<div class="tgme_widget_message_text">
    🔻طلای ۱۸ عیار: 18,500,000 تومان<br/>
    دلار تهران: 188,000 تومان<br/>
    انس طلا: 3360 دلار<br/>
    ساعت: ۱۱:۰۰<br/>
    تاریخ: ۱۴۰۵/۰۸/۰۶
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

    it("uses Telegram's outer time metadata when the message body has no timestamp", async () => {
        const html = `
<div class="tgme_widget_message_text">▫️ دلار: ۲۶۹،۵۰۰ تومان<br>🔻 انس طلا: ۴،۰۶۲.۲۹ دلار<br>▫️ طلای ۱۸ عیار: ۲۶،۴۰۸،۴۰۰ تومان</div>
<a class="tgme_widget_message_date"><time datetime="2026-10-29T07:02:00+00:00">07:02</time></a>
`;
        vi.stubGlobal("fetch", vi.fn(async () => ({
            ok: true,
            text: async () => html
        })));

        const provider = new TelegramChannelScraperMessageProvider(
            "https://t.me/s/ontimeprice"
        );
        const message = await provider.getLatestMessage();
        const price = TelegramPriceParser.parse(message);

        expect(price.gold18Price).toBe(26408400);
        expect(price.updatedAt.toISOString()).toBe("2026-10-29T07:02:00.000Z");
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
    it("accepts the current ontimeprice-style Persian message", async () => {
        const html = `
<div class="tgme_widget_message_text">
▫️ دلار: ۲۷۰،۶۸۰ تومان<br>
🔹 تتر: ۲۷۰،۸۴۷ تومان<br>
🔹 انس طلا: ۴،۰۲۶.۹۳ دلار<br>
🔻 طلای ۱۸ عیار: ۲۶،۱۸۶،۸۰۰ تومان<br>
🕰️ ۷ آبان ۱۴۰۵ - ۱۵:۳۰
</div>
`;
        vi.stubGlobal("fetch", vi.fn(async () => ({
            ok: true,
            text: async () => html
        })));

        const provider = new TelegramChannelScraperMessageProvider(
            "https://t.me/s/ontimeprice"
        );

        const result = await provider.getLatestMessage();
        expect(result).toContain("۲۶،۱۸۶،۸۰۰");
        expect(result).toContain("۲۷۰،۶۸۰");
    });

});