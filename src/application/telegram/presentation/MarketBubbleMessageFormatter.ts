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



            `${this.copyFormat(
                bubble.marketPrice
            )} تومان`,



            "",



            "🏦 قیمت ذاتی",



            `${this.copyFormat(
                bubble.intrinsicPrice
            )} تومان`,



            "",



            "🫧 مقدار حباب",



            `${this.copyFormat(
                bubble.bubbleAmount
            )} تومان`,



            "",



            "📊 درصد حباب",



            this.copyPercentFormat(

                bubble.bubblePercentage

            )



        ]);



    }









    private copyFormat(

        value:

            number

    ): string {


        return `\`${this.formatNumber(value)}\``;


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









    private copyPercentFormat(

        value:

            number

    ): string {



        return (

            `\`${

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

            }٪`

            + "`"

        );



    }





}