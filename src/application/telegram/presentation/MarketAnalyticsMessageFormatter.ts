import {
    MarketAnalytics
}
from "../../../domain/market/analytics/entities/MarketAnalytics";


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
            MarketAnalytics

    ): string {


        const change =
            analytics.getChange();



        const trend =
            analytics.getTrend();



        const range =
            analytics.getPriceRange();





        return this.builder.build([



            "📈 تحلیل بازار طلا",

            "",



            "🟡 قیمت فعلی",

            `${this.formatNumber(
                analytics.getCurrentPrice()
            )} تومان`,



            "",



            "📊 تغییرات",

            change.formatted,



            "",



            "📈 روند بازار",

            `${trend.emoji} ${this.translateTrend(trend.type)}`,



            "",



            "⚡ میزان نوسان",

            `${this.formatNumber(
                analytics.getVolatility()
            )}٪`,



            "",



            "📉 محدوده قیمت",

            `${range.formattedMin} - ${range.formattedMax}`,



            "",



            "📌 میانگین",

            `${range.formattedAverage} تومان`,



            "",



            "🕒 زمان تحلیل",

            analytics
                .getAnalyzedAt()
                .toLocaleString(
                    "fa-IR",
                    {
                        timeZone:
                            "Asia/Tehran"
                    }
                )

        ]);

    }






    private translateTrend(

        trend:
            string

    ): string {


        switch(trend) {


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
        )
        .format(
            Math.round(value)
        );


    }


}