import {
    GoldBubbleResult
}
from "../../../domain/market/services/GoldBubbleCalculator";


import {
    TelegramMessageBuilder
}
from "./TelegramMessageBuilder";


import {
    TelegramNumberFormatter
}
from "./TelegramNumberFormatter";






export class MarketBubbleMessageFormatter {





    constructor(

        private readonly builder:
            TelegramMessageBuilder,


        private readonly numberFormatter:
            TelegramNumberFormatter

    ) {}








    format(

        bubble:
            GoldBubbleResult

    ): string {





        return this.builder.build([





            "🫧 حباب طلا",



            "",





            "💰 قیمت بازار",



            this.numberFormatter.money(

                bubble.marketPrice

            ),





            "",





            "🏦 قیمت ذاتی",



            this.numberFormatter.money(

                bubble.intrinsicPrice

            ),





            "",





            "🫧 مقدار حباب",



            this.numberFormatter.money(

                bubble.bubbleAmount

            ),





            "",





            "📊 درصد حباب",



            this.formatPercent(

                bubble.bubblePercentage

            )




        ]);



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