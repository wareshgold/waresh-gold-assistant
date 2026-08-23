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

        return this.builder.build([
            "📊 <b>تحلیل کوتاه بازار</b>",
            "",
            `امتیاز بازار     ${score.formatted}`,
            `روند             ${trend.emoji} ${this.translateTrend(trend.type)}`,
            `تغییر            ${change.formatted}`,
            `نوسان            ${this.numberFormatter.percent(analytics.getVolatility())}`,
            "",
            `قیمت فعلی        ${this.numberFormatter.money(analytics.getCurrentPrice())}`,
            `بازه بازار       ${this.numberFormatter.money(range.min)} تا ${this.numberFormatter.money(range.max)}`
        ]);
    }

    private translateTrend(trend: string): string {
        switch (trend) {
            case "UP":
                return "صعودی";
            case "DOWN":
                return "نزولی";
            case "STABLE":
                return "متعادل";
            case "VOLATILE":
                return "پرنوسان";
            default:
                return "نامشخص";
        }
    }
}
