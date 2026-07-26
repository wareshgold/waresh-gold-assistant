import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    GetGoldBubbleUseCase
}
from "../../../market/GetGoldBubbleUseCase";


import {
    MarketBubbleMessageFormatter
}
from "../../presentation/MarketBubbleMessageFormatter";





export class GetGoldBubbleCallbackHandler

implements TelegramCallbackHandler {





    constructor(


        private readonly getGoldBubbleUseCase:
            GetGoldBubbleUseCase,


        private readonly marketBubbleMessageFormatter:
            MarketBubbleMessageFormatter


    ) {}









    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {



        return (


            context.callback.namespace === "gold"

            &&

            context.callback.action === "bubble"


        );


    }









    async execute(

        context:
            TelegramCallbackContext

    ): Promise<any> {



        const response =

            await this.getGoldBubbleUseCase.execute();





        return {


            type:

                "text",



            content:

                this.marketBubbleMessageFormatter.format(

                    response.data as any

                )



        };


    }



}