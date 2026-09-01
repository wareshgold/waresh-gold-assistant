import { GoldBubbleResult } from "../../../domain/market/services/GoldBubbleCalculator";
import { TelegramMessageBuilder } from "./TelegramMessageBuilder";
import { TelegramNumberFormatter } from "./TelegramNumberFormatter";

export class MarketBubbleMessageFormatter {
    constructor(
        private readonly builder: TelegramMessageBuilder,
        private readonly numberFormatter: TelegramNumberFormatter
    ) {}

    format(bubble: GoldBubbleResult): string {
        // ±3% = normal, beyond = abnormal
        const bubbleLabel = bubble.bubblePercentage > 3
            ? "🔴 حباب غیرعادی (گران‌تر از ذاتی)"
            : bubble.bubblePercentage < -3
                ? "🔴 حباب غیرعادی (ارزان‌تر از ذاتی)"
                : "🟢 حباب عادی";

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
            `${percentSign}${this.numberFormatter.percentRtl(bubble.bubblePercentage)}`
        ]);
    }
}
