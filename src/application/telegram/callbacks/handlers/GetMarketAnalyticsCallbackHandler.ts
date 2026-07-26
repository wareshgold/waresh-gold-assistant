import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    GetMarketAnalyticsUseCase
}
from "../../../market/GetMarketAnalyticsUseCase";


import {
    MarketAnalyticsMessageFormatter
}
from "../../presentation/MarketAnalyticsMessageFormatter";




export class GetMarketAnalyticsCallbackHandler

implements TelegramCallbackHandler {



    constructor(


        private readonly getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase,


        private readonly marketAnalyticsMessageFormatter:
            MarketAnalyticsMessageFormatter


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

    ): Promise<any> {


        const result =

            await this.getMarketAnalyticsUseCase.execute();






        if (!result.analytics) {


            return {


                content:

                    "📊 اطلاعات تحلیل بازار موجود نیست"


            };


        }








        return {


            content:

                this.marketAnalyticsMessageFormatter.format(

                    result.analytics

                )



        };


    }



}