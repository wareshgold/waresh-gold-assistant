import { MarketAnalytics } from "../../../domain/market/analytics/entities/MarketAnalytics";
import { MarketScore } from "../../../domain/market/analytics/value-objects/MarketScore";
import { TelegramMessageBuilder } from "./TelegramMessageBuilder";
import { TelegramNumberFormatter } from "./TelegramNumberFormatter";

export class MarketAnalyticsMessageFormatter {
    constructor(
        private readonly builder: TelegramMessageBuilder,
        private readonly numberFormatter: TelegramNumberFormatter
    ) {}

    format(analytics: MarketAnalytics, score: MarketScore): string {
        const change = analytics.getChange();
        const trend = analytics.getTrend();
        const range = analytics.getPriceRange();

        const scoreLabel = this.translateScore(score.value);
        const changeSign = change.value >= 0 ? "+" : "-";

        return this.builder.build([
            "📊 <b>تحلیل بازار</b>",
            "",
            "💰 قیمت فعلی:",
            this.numberFormatter.money(analytics.getCurrentPrice()),
            "",
            "📈 بازه ۲۴ ساعت:",
            `${this.numberFormatter.format(range.min)} تا ${this.numberFormatter.format(range.max)} تومان`,
            "",
            `🟢 وضعیت بازار:`,
            `${score.emoji} ${scoreLabel}`,
            "",
            "🧭 روند بازار:",
            `${trend.emoji} ${this.translateTrend(trend.type)}`,
            "",
            "📊 تغییر:",
            `${changeSign}${this.numberFormatter.percentRtl(Math.abs(change.value))}`,
            "",
            "🌊 نوسان:",
            this.numberFormatter.percentRtl(analytics.getVolatility())
        ]);
    }

    private translateTrend(trend: string): string {
        switch (trend) {
            case "UP":
                return "صعودی 📈";
            case "DOWN":
                return "نزولی 📉";
            case "STABLE":
                return "متعادل ➡️";
            case "VOLATILE":
                return "پرنوسان 🌊";
            default:
                return "نامشخص ❓";
        }
    }

    private translateScore(score: number): string {
        if (score >= 80) return "عالی";
        if (score >= 60) return "خوب";
        if (score >= 40) return "متوسط";
        if (score >= 20) return "ضعیف";
        return "بحرانی";
    }
}
