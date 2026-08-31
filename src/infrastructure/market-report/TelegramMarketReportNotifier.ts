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
        
        // Determine bubble status emoji
        let bubbleStatus = "";
        if (report.bubblePercentage > 3) {
            bubbleStatus = "🔴 حباب بالا";
        } else if (report.bubblePercentage > 1) {
            bubbleStatus = "🟡 حباب متوسط";
        } else if (report.bubblePercentage > -1) {
            bubbleStatus = "🟢 حباب عادی";
        } else if (report.bubblePercentage > -3) {
            bubbleStatus = "🟢 حباب منفی (ارزان)";
        } else {
            bubbleStatus = "🟢 حباب منفی (ارزان‌تر از ذاتی)";
        }

        // Determine market health
        let marketHealth = "";
        if (report.marketTrend === "UP") {
            marketHealth = "🟢 بازار مثبت";
        } else if (report.marketTrend === "DOWN") {
            marketHealth = "🔴 بازار منفی";
        } else if (report.marketTrend === "VOLATILE") {
            marketHealth = "🟡 بازار پرنوسان";
        } else {
            marketHealth = "⚪ بازار باثبات";
        }

        await this.botClient.sendMessage({
            chatId: userId,
            text: [
                `📊 <b>گزارش بازار طلا</b>`,
                ``,
                `💰 <b>قیمت‌ها</b>`,
                ``,
                `طلای ۱۸ عیار:`,
                `${formatPrice(report.gold18Price)} تومان`,
                ``,
                `دلار:`,
                `${formatPrice(report.currencyPrice)} تومان`,
                report.ouncePrice ? `\nانس:\n${formatWithCommas(report.ouncePrice, 2)} دلار` : ``,
                ``,
                `📈 <b>وضعیت بازار</b>`,
                ``,
                `${marketHealth}`,
                ``,
                `روند:`,
                `${trend}`,
                ``,
                `تغییر:`,
                `${change}`,
                ``,
                `🫧 <b>حباب طلا</b>`,
                ``,
                `${bubbleStatus}`,
                ``,
                `مبلغ:`,
                `${bubbleSign}${formatPrice(report.bubbleAmount)} تومان`,
                ``,
                `🕒 ${report.updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`
            ].filter(Boolean).join("\n"),
            parseMode: "HTML"
        });
    }
}
