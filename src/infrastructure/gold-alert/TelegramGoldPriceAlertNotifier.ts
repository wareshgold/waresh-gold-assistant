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
