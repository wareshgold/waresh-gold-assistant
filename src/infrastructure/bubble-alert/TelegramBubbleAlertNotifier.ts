import { BubbleAlertNotifier } from "../../application/jobs/BubbleAlertSchedulerJob";
import { GoldBubbleResult } from "../../domain/market/services/GoldBubbleCalculator";
import { TelegramBotClient } from "../telegram/TelegramBotClient";
import { TelegramNumberFormatter } from "../../application/telegram/presentation/TelegramNumberFormatter";
import { formatWithCommas } from "../../shared/utils/number";

export class TelegramBubbleAlertNotifier implements BubbleAlertNotifier {
    private readonly numberFormatter = new TelegramNumberFormatter();

    constructor(private readonly botClient: TelegramBotClient) {}

    async send(
        userId: string,
        bubblePercent: number,
        alertType: "POSITIVE" | "NEGATIVE",
        bubbleResult: GoldBubbleResult
    ): Promise<void> {
        const icon = alertType === "POSITIVE" ? "📈" : "📉";
        const label = alertType === "POSITIVE"
            ? "حباب مثبت"
            : "حباب منفی";

        const text = [
            `${icon} <b>هشدار حباب طلا</b>`,
            "",
            `⚠️ حباب طلا از آستانه رد شد!`,
            "",
            `🫧 حباب: <b>${bubblePercent >= 0 ? "+" : ""}${formatWithCommas(bubblePercent, 2)}٪</b> (${label})`,
            `💰 قیمت بازار: ${this.numberFormatter.money(bubbleResult.marketPrice)}`,
            `💎 قیمت ذاتی: ${this.numberFormatter.money(bubbleResult.intrinsicPrice)}`,
            `📊 مبلغ حباب: ${this.numberFormatter.money(bubbleResult.bubbleAmount)}`,
            "",
            `💡 ${alertType === "POSITIVE"
                ? "قیمت بازار بالاتر از ارزش ذاتی هست — احتیاط کنید!"
                : "قیمت بازار پایین‌تر از ارزش ذاتی هست — فرصت خرید ممکن باشد."}`
        ].join("\n");

        try {
            await this.botClient.sendMessage({
                chatId: userId,
                text,
                parseMode: "HTML"
            });
        } catch (error) {
            console.error("Bubble alert notify failed", { userId, error });
        }
    }
}
