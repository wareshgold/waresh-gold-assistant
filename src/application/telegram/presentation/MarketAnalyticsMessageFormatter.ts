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

            `${this.copyFormat(
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

            `${this.copyPercent(
                analytics.getVolatility()
            )}`,



            "",



            "📉 محدوده قیمت",

            `${this.copyFormat(range.formattedMin)} - ${this.copyFormat(range.formattedMax)}`,



            "",



            "📌 میانگین",

            `${this.copyFormat(range.formattedAverage)} تومان`,



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








    private copyFormat(

        value:

            number | string

    ): string {


        return `\`${value}\``;


    }








    private copyPercent(

        value:

            number

    ): string {


        return (

            `\`${

                new Intl.NumberFormat(

                    "fa-IR"

                )

                .format(

                    value

                )

            }٪\``

        );


    }




}