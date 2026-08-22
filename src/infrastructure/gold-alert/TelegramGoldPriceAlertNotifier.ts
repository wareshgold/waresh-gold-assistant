import {
    TelegramBotClient
} from "../telegram/TelegramBotClient";

import {
    GoldPriceAlertNotifier
} from "../../application/jobs/GoldPriceAlertSchedulerJob";

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
        const format = (value: number) =>
            new Intl.NumberFormat("fa-IR")
                .format(Math.round(value));

        await this.botClient.sendMessage({
            chatId: userId,
            text: [
                "🔔 اعلان قیمت طلا",
                "",
                `🟡 طلای ۱۸ عیار: ${format(gold18Price)} تومان`,
                `💵 دلار: ${format(currencyPrice)} تومان`,
                `🌎 اونس جهانی: ${ouncePrice === null ? "ناموجود" : `${format(ouncePrice)} دلار`}`,
                "",
                `🕒 بروزرسانی: ${updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
