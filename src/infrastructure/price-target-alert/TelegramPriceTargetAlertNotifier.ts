import { TelegramBotClient } from "../telegram/TelegramBotClient";
import { TelegramNumberFormatter } from "../../application/telegram/presentation/TelegramNumberFormatter";

export class TelegramPriceTargetAlertNotifier {
    private readonly numberFormatter = new TelegramNumberFormatter();

    constructor(private readonly botClient: TelegramBotClient) {}

    async send(
        userId: string,
        targetPrice: number,
        direction: "ABOVE" | "BELOW",
        currentPrice: number
    ): Promise<void> {
        const dirLabel = direction === "ABOVE" ? "📈 قیمت افزایش یافت" : "📉 قیمت کاهش یافت";
        const dirEmoji = direction === "ABOVE" ? "⬆️" : "⬇️";
        const diff = direction === "ABOVE"
            ? currentPrice - targetPrice
            : targetPrice - currentPrice;
        const diffPercent = (diff / targetPrice) * 100;

        const text = [
            `🎯 <b>هشدار رسیدن به قیمت!</b>`,
            "",
            dirLabel,
            "",
            `${dirEmoji} قیمت هدف: ${this.numberFormatter.money(targetPrice)}`,
            `💰 قیمت فعلی: ${this.numberFormatter.money(currentPrice)}`,
            "",
            `📊 اختلاف: ${diff >= 0 ? "+" : ""}${this.numberFormatter.money(diff)} (${diff >= 0 ? "+" : ""}${this.numberFormatter.percent(diffPercent)})`,
            "",
            "🔔 این هشدار یک‌بار مصرف بود و حذف شد."
        ].join("\n");

        try {
            await this.botClient.sendMessage({
                chatId: userId,
                text,
                parseMode: "HTML"
            });
        } catch (error) {
            console.error("Price target alert notify failed", { userId, error });
        }
    }
}
