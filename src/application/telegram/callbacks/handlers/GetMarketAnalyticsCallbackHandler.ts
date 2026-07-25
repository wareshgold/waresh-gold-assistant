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




export class GetMarketAnalyticsCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly getMarketAnalyticsUseCase:
            GetMarketAnalyticsUseCase

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

                JSON.stringify(

                    result.analytics

                )



        };


    }



}