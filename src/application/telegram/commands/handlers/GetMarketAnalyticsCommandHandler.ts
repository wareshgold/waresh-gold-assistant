import { TelegramCommandContext }
from "../TelegramCommandContext";


import {
    TelegramCommandHandler,
    TelegramCommandResponse
}
from "../TelegramCommandHandler";


import { GetMarketAnalyticsUseCase }
from "../../../market/GetMarketAnalyticsUseCase";


import { MarketAnalyticsMessageFormatter }
from "../../presentation/MarketAnalyticsMessageFormatter";




export class GetMarketAnalyticsCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase,


        private readonly marketAnalyticsMessageFormatter:
            MarketAnalyticsMessageFormatter

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





        if (!result.analytics || !result.score) {


            return {

                type:
                    "text",

                content:
                    "⚠️ اطلاعات تحلیل بازار در دسترس نیست"

            };


        }






        return {


            type:
                "text",


            content:

                this.marketAnalyticsMessageFormatter.format(

                    result.analytics,

                    result.score

                )


        };


    }


}