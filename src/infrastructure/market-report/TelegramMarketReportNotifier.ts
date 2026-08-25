import { MarketReportData, MarketReportNotifier } from "../../application/jobs/MarketReportSchedulerJob";
import { TelegramBotClient } from "../telegram/TelegramBotClient";

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
                `🌎 اونس جهانی: ${report.ouncePrice === null ? "ناموجود" : `${toPersianDigits(report.ouncePrice.toFixed(2))} دلار`}`,
                "",
                `📈 تغییر بازار: ${change}`,
                `🧭 روند بازار: ${trend}`,
                `🫧 حباب طلا: ${bubbleSign}${formatPrice(report.bubbleAmount)} تومان`,
                `📊 حباب: ${toPersianDigits(report.bubblePercentage.toFixed(2))}%`,
                "",
                `🕒 بروزرسانی: ${report.updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].join("\n")
        });
    }
}
