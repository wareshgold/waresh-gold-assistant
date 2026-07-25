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




export class GetGoldBubbleCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly getGoldBubbleUseCase:
            GetGoldBubbleUseCase

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


        return this.getGoldBubbleUseCase.execute();


    }



}