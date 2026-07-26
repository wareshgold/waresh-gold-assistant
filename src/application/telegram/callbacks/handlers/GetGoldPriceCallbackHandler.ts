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


import {
    TelegramNavigationService
}
from "../../navigation/TelegramNavigationService";





export class GetGoldPriceCallbackHandler

implements TelegramCallbackHandler {



    constructor(


        private readonly getGoldPriceUseCase:

            GetGoldPriceUseCase,



        private readonly telegramNavigationService:

            TelegramNavigationService


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



        const response =

            await this.getGoldPriceUseCase.execute();





        return {


            ...response,



            replyMarkup: {


                type:

                    "INLINE",



                rows: [



                    [

                        {

                            text:

                                "📊 بازگشت به بازار",


                            actionId:

                                "menu:market",

                        }

                    ],




                    [

                        {

                            text:

                                "🏠 منوی اصلی",


                            actionId:

                                "menu:main",

                        }

                    ]



                ]

            }


        };


    }


}