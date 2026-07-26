import {
    ApplicationResponse
}
from "../../common/models/ApplicationResponse";


import {
    TelegramMessageBuilder
}
from "./TelegramMessageBuilder";



export class GoldPriceMessageFormatter {


    constructor(

        private readonly builder:
            TelegramMessageBuilder

    ) {}





    format(

        response:
            ApplicationResponse

    ): string {


        const metadata =
            response.metadata ?? {};



        return this.builder.build([


            "💰 قیمت لحظه‌ای طلا",

            "",

            "🟡 طلای ۱۸ عیار",

            `${this.number(metadata.gold18Price)} تومان`,


            "",

            "💵 دلار",

            `${this.number(metadata.currencyPrice)} تومان`,


            "",

            "🌎 اونس جهانی",

            `${this.number(metadata.ouncePrice)} دلار`,


            "",

            "🕒 بروزرسانی",

            this.date(metadata.updatedAt)

        ]);


    }





    private number(

        value:
            unknown

    ): string {


        return typeof value === "number"

            ? new Intl.NumberFormat(
                "fa-IR"
            ).format(
                Math.round(value)
            )

            : "-";


    }





    private date(

        value:
            unknown

    ): string {


        return value

            ? new Date(
                value as string
            ).toLocaleString(
                "fa-IR",
                {
                    timeZone: "Asia/Tehran"
                }
            )

            : "-";


    }


}