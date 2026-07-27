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



export class GoldPriceMessageFormatter {


    constructor(

        private readonly builder:
            TelegramMessageBuilder,


        private readonly dateFormatter:
            TelegramDateFormatter

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

            `${this.copyNumber(metadata.gold18Price)} تومان`,


            "",


            "💵 دلار",

            `${this.copyNumber(metadata.currencyPrice)} تومان`,


            "",


            "🌎 اونس جهانی",

            `${this.copyNumber(metadata.ouncePrice)} دلار`,


            "",


            "🕒 بروزرسانی",

            this.date(metadata.updatedAt)

        ]);


    }








    private copyNumber(

        value:
            unknown

    ): string {


        return typeof value === "number"

            ? `\`${new Intl.NumberFormat(

                "fa-IR"

            )
            .format(

                Math.round(value)

            )}\``

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