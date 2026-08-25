import { MarketReportData, MarketReportNotifier } from "../../application/jobs/MarketReportSchedulerJob";
import { TelegramBotClient } from "../telegram/TelegramBotClient";

export class TelegramMarketReportNotifier implements MarketReportNotifier {
    constructor(private readonly botClient: TelegramBotClient) {}

    async send(userId: string, report: MarketReportData): Promise<void> {
        const format = (value: number) =>
            new Intl.NumberFormat("en-US").format(Math.round(value));

        const trend = report.marketTrend === "UP"
            ? "📈 صعودی"
            : report.marketTrend === "DOWN"
                ? "📉 نزولی"
                : report.marketTrend === "VOLATILE"
                    ? "📊 پرنوسان"
                    : report.marketTrend === "STABLE"
                        ? "➡️ باثبات"
                        : "نامشخص";

        const change = report.marketChange ?? "نامشخص";
        const bubbleSign = report.bubbleAmount > 0 ? "+" : "";

        await this.botClient.sendMessage({
            chatId: userId,
            text: [
                "📊 گزارش بازار طلا",
                "━━━━━━━━━━━━━━",
                "",
                `🪙 طلای ۱۸ عیار: ${format(report.gold18Price)} تومان`,
                `💵 دلار: ${format(report.currencyPrice)} تومان`,
                `🌎 انس جهانی: ${report.ouncePrice === null ? "ناموجود" : `${report.ouncePrice.toFixed(2)} دلار`}`,
                "",
                `📈 تغییر بازار: ${change}`,
                `🧭 روند بازار: ${trend}`,
                `🫧 حباب طلا: ${bubbleSign}${format(report.bubbleAmount)} تومان`,
                `📊 حباب: ${report.bubblePercentage.toFixed(2)}%`,
                "",
                `🕒 بروزرسانی: ${report.updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
