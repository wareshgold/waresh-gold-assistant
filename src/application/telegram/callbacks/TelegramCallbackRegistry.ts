import {
    TelegramCallbackRouter
}
from "./TelegramCallbackRouter";


import {
    TelegramCallbackHandler
}
from "./TelegramCallbackHandler";


import {
    GetGoldPriceCallbackHandler
}
from "./handlers/GetGoldPriceCallbackHandler";


import {
    GetGoldPriceUseCase
}
from "../../usecases/GetGoldPriceUseCase";





export class TelegramCallbackRegistry {




    static create(

        getGoldPriceUseCase:
            GetGoldPriceUseCase

    ): TelegramCallbackRouter {



        const handlers:

            TelegramCallbackHandler[] = [


                new GetGoldPriceCallbackHandler(

                    getGoldPriceUseCase

                )


            ];





        return new TelegramCallbackRouter(

            handlers

        );


    }



}