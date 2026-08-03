import {
    MarketAnalytics
}
from "../../../domain/market/analytics/entities/MarketAnalytics";

import {
    MarketScore
}
from "../../../domain/market/analytics/value-objects/MarketScore";

import {
    TelegramMessageBuilder
}
from "./TelegramMessageBuilder";


export class MarketAnalyticsMessageFormatter {


    constructor(

        private readonly builder:
            TelegramMessageBuilder

    ) {}


    format(

        analytics:
            MarketAnalytics,

        score:
            MarketScore

    ): string {


        const change =
            analytics.getChange();


        const trend =
            analytics.getTrend();


        const range =
            analytics.getPriceRange();


        return this.builder.build([

            "📊 تحلیل بازار طلا",

            "",

            `امتیاز بازار: ${score.formatted}`,

            "",

            `📈 روند: ${trend.emoji} ${this.translateTrend(trend.type)}`,

            `📊 تغییر: ${change.formatted}`,

            `⚡ نوسان: ${this.formatNumber(analytics.getVolatility())}٪`,

            "",

            `💰 قیمت فعلی: ${this.formatNumber(
                analytics.getCurrentPrice()
            )} تومان`,

            `📉 بازه: ${range.formattedMin} تا ${range.formattedMax} تومان`

        ]);

    }


    private translateTrend(

        trend:
            string

    ): string {


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


    private formatNumber(

        value:
            number

    ): string {


        return new Intl.NumberFormat(
            "fa-IR"
        ).format(
            Math.round(value)
        );

    }

}