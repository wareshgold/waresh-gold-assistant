import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

import {
    GoldPriceAlertNotifier
} from "../../application/jobs/GoldPriceAlertSchedulerJob";

import { formatWithCommas } from "../../shared/utils/number";

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
            parseMode: "HTML",
            text: [
                "🔔 اعلان قیمت طلا",
                "",
                `🟡 طلای ۱۸ عیار: ${formatWithCommas(gold18Price)} تومان`,
                `💵 دلار: ${formatWithCommas(currencyPrice)} تومان`,
                `🌎 انس جهانی: ${ouncePrice === null ? "ناموجود" : `${formatWithCommas(ouncePrice, 2)} دلار`}`,
                "",
                `🕒 بروزرسانی: ${updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
