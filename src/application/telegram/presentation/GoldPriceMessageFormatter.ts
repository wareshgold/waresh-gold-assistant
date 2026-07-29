import {
    ApplicationResponse
}
from "../../common/models/ApplicationResponse";


import {
    TelegramMessageBuilder
}
from "./TelegramMessageBuilder";


import {
    TelegramDateFormatter
}
from "./TelegramDateFormatter";


import {
    TelegramNumberFormatter
}
from "./TelegramNumberFormatter";



export class GoldPriceMessageFormatter {


    constructor(


        private readonly builder:
            TelegramMessageBuilder,


        private readonly dateFormatter:
            TelegramDateFormatter,


        private readonly numberFormatter:
            TelegramNumberFormatter


    ) {}





    format(

        response:
            ApplicationResponse

    ): string {


        const metadata =
            response.metadata ?? {};



        return this.builder.build([



            "🟡 قیمت لحظه‌ای طلا",


            "",



            "💰 طلای ۱۸ عیار",

            this.number(

                metadata.gold18Price

            ) + " تومان",



            "",



            "💵 دلار",

            this.number(

                metadata.currencyPrice

            ) + " تومان",



            "",



            "🌎 اونس جهانی",

            this.number(

                metadata.ouncePrice

            ) + " دلار",



            "",



            "🕒 بروزرسانی",

            this.date(

                metadata.updatedAt

            )

        ]);


    }







    private number(

        value:
            unknown

    ): string {


        return typeof value === "number"

            ? this.numberFormatter.formatCode(value)

            : "-";


    }









    private date(

        value:
            unknown

    ): string {


        return value

            ? this.dateFormatter.format(

                new Date(
                    value as string
                )

            )

            : "-";


    }



}