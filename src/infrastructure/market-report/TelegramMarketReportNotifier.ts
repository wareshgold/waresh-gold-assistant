import { TelegramBotClient } from "../telegram/TelegramBotClient";
import { MarketReportNotifier } from "../../application/jobs/MarketReportSchedulerJob";

export class TelegramMarketReportNotifier implements MarketReportNotifier {
    constructor(private readonly botClient: TelegramBotClient) {}

    async send(
        userId: string,
        gold18Price: number,
        currencyPrice: number,
        ouncePrice: number | null,
        updatedAt: Date
    ): Promise<void> {
        const format = (value: number) =>
            new Intl.NumberFormat("fa-IR").format(Math.round(value));

        await this.botClient.sendMessage({
            chatId: userId,
            text: [
                "📊 گزارش بازار طلا",
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
