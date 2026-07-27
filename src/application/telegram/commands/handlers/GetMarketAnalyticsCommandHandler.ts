import { TelegramCommandContext }
from "../TelegramCommandContext";

import {
    TelegramCommandHandler,
    TelegramCommandResponse
}
from "../TelegramCommandHandler";

import { GetMarketAnalyticsUseCase }
from "../../../market/GetMarketAnalyticsUseCase";



export class GetMarketAnalyticsCommandHandler

implements TelegramCommandHandler {



    constructor(

        private readonly getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase

    ) {}





    metadata() {

        return {

            command:
                "/analytics",

            description:
                "تحلیل بازار طلا"

        };

    }





    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim();



        return (

            normalizedCommand === "/analytics" ||

            normalizedCommand === "تحلیل" ||

            normalizedCommand === "تحلیل بازار"

        );


    }









    async execute(

        context: TelegramCommandContext

    ): Promise<TelegramCommandResponse> {



        const result =

            await this.getMarketAnalyticsUseCase
                .execute();





        if (!result.analytics) {


            return {

                type: "text",

                content:

                    "⚠️ اطلاعات تحلیل بازار در دسترس نیست"

            };


        }










        const analytics =
            result.analytics;









        const trendText =

            analytics.getTrend().isUp

                ? "صعودی 📈"

                : analytics.getTrend().isDown

                    ? "نزولی 📉"

                    : "ثابت ➡️";











        const volatility =

            analytics.getVolatility();









        const volatilityText =

            volatility >= 3

                ? "زیاد 🔴"

                : volatility >= 1

                    ? "متوسط 🟡"

                    : "کم 🟢";









        const range =

            analytics.getPriceRange();









        return {


            type: "text",


            content:


                [

                    "📊 گزارش هوشمند بازار طلا",

                    "",


                    `💰 قیمت فعلی:
${this.copyNumber(
    analytics.getCurrentPrice()
)} تومان`,


                    "",


                    `📈 تغییر:
${analytics
    .getChange()
    .formatted}`,


                    "",


                    `🔥 وضعیت روند:
${trendText}`,


                    "",


                    `🌊 شدت نوسان:
${volatilityText} (${volatility.toFixed(2)}%)`,


                    "",


                    `📌 محدوده ۵۰ رکورد اخیر:
${this.copyRange(range)}`,


                    "",


                    `🕒 آخرین تحلیل:
${analytics
    .getAnalyzedAt()
    .toLocaleString(
        "fa-IR",
        {
            timeZone:
                "Asia/Tehran"
        }
    )}`


                ].join("\n")


        };


    }










    private copyNumber(

        value: number

    ): string {


        return `\`${new Intl.NumberFormat(

            "fa-IR"

        ).format(

            Math.round(value)

        )}\``;


    }








    private copyRange(

        range: {

            formattedMin: string;

            formattedMax: string;

            formattedAverage: string;

        }

    ): string {


        return (

            `\`${range.formattedMin}\` - ` +

            `\`${range.formattedMax}\` - ` +

            `میانگین: \`${range.formattedAverage}\``

        );


    }


}