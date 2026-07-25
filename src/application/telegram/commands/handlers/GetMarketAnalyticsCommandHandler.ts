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









        return {


            type: "text",


            content:


                [

                    "📊 گزارش هوشمند بازار طلا",

                    "",


                    `💰 قیمت فعلی:
${analytics
    .getCurrentPrice()
    .toLocaleString("fa-IR")} تومان`,


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
${analytics
    .getPriceRange()
    .toString()}`,


                    "",


                    `🕒 آخرین تحلیل:
${analytics
    .getAnalyzedAt()
    .toLocaleString("fa-IR")}`


                ].join("\n")


        };


    }


}