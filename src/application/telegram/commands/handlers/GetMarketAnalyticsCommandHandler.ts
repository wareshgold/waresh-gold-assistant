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



        return {

            type: "text",

            content:

                [

                    "📊 تحلیل بازار طلا",

                    "",

                    `💰 قیمت فعلی: ${analytics.getCurrentPrice()}`,

                    `📈 تغییر: ${analytics.getChange().formatted}`,

                    `روند: ${analytics.getTrend().emoji}`,

                    `نوسان: ${analytics.getVolatility().toFixed(2)}`

                ].join("\n")


        };


    }


}