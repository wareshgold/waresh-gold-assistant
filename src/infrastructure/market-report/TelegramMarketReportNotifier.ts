import { MarketReportData, MarketReportNotifier } from "../../application/jobs/MarketReportSchedulerJob";
import { TelegramBotClient } from "../telegram/TelegramBotClient";
import { formatPrice, formatWithCommas } from "../../shared/utils/number";
import { TelegramFooter } from "../../application/telegram/presentation/TelegramFooter";

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
        
        // Determine bubble status emoji (±3% = normal, beyond = abnormal)
        let bubbleStatus = "";
        if (report.bubblePercentage > 3) {
            bubbleStatus = "🔴 حباب غیرعادی (گران‌تر از ذاتی)";
        } else if (report.bubblePercentage < -3) {
            bubbleStatus = "🔴 حباب غیرعادی (ارزان‌تر از ذاتی)";
        } else {
            bubbleStatus = "🟢 حباب عادی";
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
                `🕒 ${report.updatedAt.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}`,
                TelegramFooter.FOOTER
            ].filter(Boolean).join("\n"),
            parseMode: "HTML"
        });
    }
}
