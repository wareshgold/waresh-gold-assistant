import {
    GoldBubbleResult
}
from "../../../domain/market/services/GoldBubbleCalculator";


import {
    TelegramMessageBuilder
}
from "./TelegramMessageBuilder";





export class MarketBubbleMessageFormatter {





    constructor(

        private readonly builder:
            TelegramMessageBuilder

    ) {}








    format(

        bubble:
            GoldBubbleResult

    ): string {





        return this.builder.build([





            "🫧 حباب طلا",



            "",





            "💰 قیمت بازار",



            `${this.formatNumber(
                bubble.marketPrice
            )} تومان`,





            "",





            "🏦 قیمت ذاتی",



            `${this.formatNumber(
                bubble.intrinsicPrice
            )} تومان`,





            "",





            "🫧 مقدار حباب",



            `${this.formatNumber(
                bubble.bubbleAmount
            )} تومان`,





            "",





            "📊 درصد حباب",



            this.formatPercent(
                bubble.bubblePercentage
            )




        ]);



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









    private formatPercent(

        value:
            number

    ): string {



        return (

            new Intl.NumberFormat(

                "fa-IR",

                {

                    minimumFractionDigits:
                        2,


                    maximumFractionDigits:
                        2

                }

            )

            .format(value)

            +

            "٪"

        );


    }



}