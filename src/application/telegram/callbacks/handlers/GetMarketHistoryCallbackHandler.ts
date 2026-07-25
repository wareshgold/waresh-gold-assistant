import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    GetMarketHistoryUseCase
}
from "../../../market/GetMarketHistoryUseCase";




export class GetMarketHistoryCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly getMarketHistoryUseCase:
            GetMarketHistoryUseCase

    ) {}





    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === "market"

            &&

            context.callback.action === "history"

        );


    }







    async execute(

        context:
            TelegramCallbackContext

    ): Promise<any> {


        const result =

            await this.getMarketHistoryUseCase.execute(5);




        return {


            content:

                result.items.length

                    ? result.items

                        .map(

                            item =>

                                JSON.stringify(item)

                        )

                        .join("\n")

                    :

                    "📜 تاریخچه‌ای موجود نیست"



        };


    }



}