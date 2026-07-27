import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    TelegramCommandResponse,
}
from "../../commands/TelegramCommandHandler";


import {
    GetMarketAnalyticsUseCase
}
from "../../../market/GetMarketAnalyticsUseCase";


import {
    MarketAnalyticsMessageFormatter
}
from "../../presentation/MarketAnalyticsMessageFormatter";


import {
    TelegramNavigationService
}
from "../../navigation/TelegramNavigationService";








export class GetMarketAnalyticsCallbackHandler

implements TelegramCallbackHandler {





    constructor(


        private readonly getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase,


        private readonly marketAnalyticsMessageFormatter:
            MarketAnalyticsMessageFormatter,


        private readonly telegramNavigationService:
            TelegramNavigationService


    ) {}









    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === "market"

            &&

            context.callback.action === "analytics"

        );


    }











    async execute(

        context:
            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {


        const result =

            await this.getMarketAnalyticsUseCase.execute();








        if (!result.analytics) {


            return {


                type:

                    "text",


                content:

                    "📊 اطلاعات تحلیل بازار موجود نیست",


                replyMarkup:

                    this.telegramNavigationService.getMarketMenu()


            };


        }









        return {


            type:

                "text",



            content:

                this.marketAnalyticsMessageFormatter.format(

                    result.analytics

                ),



            replyMarkup:

                this.telegramNavigationService.getMarketMenu()



        };


    }



}