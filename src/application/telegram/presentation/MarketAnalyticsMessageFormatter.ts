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

            `${this.copyNumber(
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

            `${this.copyValue(range.formattedMin)} - ${this.copyValue(range.formattedMax)}`,



            "",



            "📌 میانگین",

            `${this.copyValue(range.formattedAverage)} تومان`,



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









    private copyNumber(

        value:

            number

    ): string {


        return `\`${new Intl.NumberFormat(

            "fa-IR"

        )

        .format(

            Math.round(value)

        )}\``;


    }









    private copyValue(

        value:

            string

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

                    "fa-IR",

                    {

                        maximumFractionDigits:

                            2

                    }

                )

                .format(

                    value

                )

            }٪\``

        );


    }




}