import { MarketReportData, MarketReportNotifier } from "../../application/jobs/MarketReportSchedulerJob";
import { TelegramBotClient } from "../telegram/TelegramBotClient";
import { formatPrice, formatWithCommas } from "../../shared/utils/number";

export class TelegramMarketReportNotifier implements MarketReportNotifier {
    constructor(private readonly botClient: TelegramBotClient) {}

    async send(userId: string, report: MarketReportData): Promise<void> {
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
                `🪙 طلای ۱۸ عیار: ${formatPrice(report.gold18Price)} تومان`,
                `💵 دلار: ${formatPrice(report.currencyPrice)} تومان`,
                `🌎 انس جهانی: ${report.ouncePrice === null ? "ناموجود" : `${formatWithCommas(report.ouncePrice, 2)} دلار`}`,
                "",
                `📈 تغییر بازار: ${change}`,
                `🧭 روند بازار: ${trend}`,
                `🫧 حباب طلا: ${bubbleSign}${formatPrice(report.bubbleAmount)} تومان`,
                `📊 حباب: ${formatWithCommas(report.bubblePercentage, 2)}٪`,
                "",
                `🕒 بروزرسانی: ${report.updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
