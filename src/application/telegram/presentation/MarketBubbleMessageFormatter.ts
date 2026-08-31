import { GoldBubbleResult } from "../../../domain/market/services/GoldBubbleCalculator";
import { TelegramMessageBuilder } from "./TelegramMessageBuilder";
import { TelegramNumberFormatter } from "./TelegramNumberFormatter";

export class MarketBubbleMessageFormatter {
    constructor(
        private readonly builder: TelegramMessageBuilder,
        private readonly numberFormatter: TelegramNumberFormatter
    ) {}

    format(bubble: GoldBubbleResult): string {
        const bubbleLabel = bubble.bubbleAmount > 0
            ? "🔴 حباب مثبت (گران‌تر از ارزش ذاتی)"
            : bubble.bubbleAmount < 0
                ? "🟢 حباب منفی (ارزان‌تر از ارزش ذاتی)"
                : "⚪ بدون حباب";

        const amountSign = bubble.bubbleAmount > 0 ? "+" : "";
        const percentSign = bubble.bubblePercentage > 0 ? "+" : "";

        return this.builder.build([
            "🫧 <b>حباب طلای ۱۸ عیار</b>",
            "",
            "💰 قیمت بازار:",
            this.numberFormatter.money(bubble.marketPrice),
            "",
            "💎 قیمت ذاتی:",
            this.numberFormatter.money(bubble.intrinsicPrice),
            "",
            bubbleLabel,
            "",
            "📊 مبلغ حباب:",
            `${amountSign}${this.numberFormatter.money(bubble.bubbleAmount)}`,
            "",
            "📈 درصد حباب:",
            `${percentSign}${this.numberFormatter.percent(bubble.bubblePercentage)}`
        ]);
    }
}
