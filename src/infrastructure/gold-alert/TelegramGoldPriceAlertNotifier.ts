import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

import {
    GoldPriceAlertNotifier
} from "../../application/jobs/GoldPriceAlertSchedulerJob";

function toPersianDigits(text: string): string {
    return text.replace(/[0-9]/g, d =>
        String.fromCharCode(0x06F0 + Number(d))
    );
}

function formatPrice(value: number): string {
    return toPersianDigits(
        Math.round(value).toLocaleString("en-US")
    );
}

export class TelegramGoldPriceAlertNotifier
implements GoldPriceAlertNotifier {
    constructor(
        private readonly botClient: TelegramBotClient
    ) {}

    async send(
        userId: string,
        gold18Price: number,
        currencyPrice: number,
        ouncePrice: number | null,
        updatedAt: Date
    ): Promise<void> {
        await this.botClient.sendMessage({
            chatId: userId,
            text: [
                "🔔 اعلان قیمت طلا",
                "",
                `🟡 طلای ۱۸ عیار: ${formatPrice(gold18Price)} تومان`,
                `💵 دلار: ${formatPrice(currencyPrice)} تومان`,
                `🌎 اونس جهانی: ${ouncePrice === null ? "ناموجود" : `${formatPrice(ouncePrice)} دلار`}`,
                "",
                `🕒 بروزرسانی: ${updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
