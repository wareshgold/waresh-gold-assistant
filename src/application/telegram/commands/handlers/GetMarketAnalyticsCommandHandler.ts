import { TelegramCommandContext }
from "../TelegramCommandContext";

import { TelegramCommandHandler }
from "../TelegramCommandHandler";

import { GetMarketAnalyticsUseCase }
from "../../../market/GetMarketAnalyticsUseCase";



export class GetMarketAnalyticsCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase

    ) {}





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

    ): Promise<any> {



        const result =

            await this.getMarketAnalyticsUseCase
                .execute();




        if (!result.analytics) {


            return {

                type: "text",

                content:
                    "اطلاعات تحلیل بازار موجود نیست"

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







        return {


            type: "text",


            content:


                [

                    "📊 تحلیل بازار طلا",

                    "",


                    `💰 قیمت فعلی: ${analytics
                        .getCurrentPrice()
                        .toLocaleString("fa-IR")} تومان`,


                    `📈 تغییر: ${analytics
                        .getChange()
                        .formatted}`,


                    `🔥 روند: ${trendText}`,


                    `🌊 نوسان: ${analytics
                        .getVolatility()
                        .toFixed(2)}%`,


                    `📌 محدوده ۵۰ رکورد اخیر: ${analytics
                        .getPriceRange()
                        .toString()}`,


                    `🕒 زمان تحلیل: ${analytics
                        .getAnalyzedAt()
                        .toLocaleString("fa-IR")}`


                ].join("\n")


        };


    }


}