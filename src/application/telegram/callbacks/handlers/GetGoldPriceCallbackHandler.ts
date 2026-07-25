import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    GetGoldPriceUseCase
}
from "../../../usecases/GetGoldPriceUseCase";




export class GetGoldPriceCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly getGoldPriceUseCase:
            GetGoldPriceUseCase

    ) {}





    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === "gold"

            &&

            context.callback.action === "price"

        );


    }






    async execute(

        context:
            TelegramCallbackContext

    ): Promise<any> {


        return this.getGoldPriceUseCase.execute();


    }


}