import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

import {
    GoldPriceAlertNotifier
} from "../../application/jobs/GoldPriceAlertSchedulerJob";

import { formatPrice } from "../../shared/utils/number";

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
        const price = (value: number) =>
            `<code>${formatPrice(value)}</code>`;

        await this.botClient.sendMessage({
            chatId: userId,
            parseMode: "HTML",
            text: [
                "🔔 اعلان قیمت طلا",
                "",
                `🟡 طلای ۱۸ عیار: ${price(gold18Price)} تومان`,
                `💵 دلار: ${price(currencyPrice)} تومان`,
                `🌎 اونس جهانی: ${ouncePrice === null ? "ناموجود" : `${price(ouncePrice)} دلار`}`,
                "",
                `🕒 بروزرسانی: ${updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
