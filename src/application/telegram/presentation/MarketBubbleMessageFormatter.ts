import { GoldBubbleResult } from "../../../domain/market/services/GoldBubbleCalculator";
import { TelegramMessageBuilder } from "./TelegramMessageBuilder";
import { TelegramNumberFormatter } from "./TelegramNumberFormatter";

export class MarketBubbleMessageFormatter {
    constructor(
        private readonly builder: TelegramMessageBuilder,
        private readonly numberFormatter: TelegramNumberFormatter
    ) {}

    format(bubble: GoldBubbleResult): string {
        const sign = bubble.bubbleAmount > 0 ? "🔴" : bubble.bubbleAmount < 0 ? "🟢" : "⚪";

        return this.builder.build([
            "🫧 <b>حباب طلای ۱۸ عیار</b>",
            "",
            `قیمت بازار     ${this.numberFormatter.money(bubble.marketPrice)}`,
            `قیمت ذاتی      ${this.numberFormatter.money(bubble.intrinsicPrice)}`,
            `حباب           ${sign} ${this.numberFormatter.money(bubble.bubbleAmount)}`,
            `درصد حباب       ${this.numberFormatter.percent(bubble.bubblePercentage)}`,
            "",
            "🔎 مثبت = قیمت بازار بالاتر از ارزش ذاتی"
        ]);
    }
}
