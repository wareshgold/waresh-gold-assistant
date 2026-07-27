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

    ):

        Promise<TelegramCommandResponse> {



        const response =

            await this.getGoldPriceUseCase.execute();






        return {


            type:

                "text",



            content:

                response.content,



            replyMarkup:


                {

                    type:

                        "INLINE",



                    rows:


                        [

                            [

                                {

                                    text:

                                        "📋 کپی قیمت",


                                    actionId:

                                        "gold:copy_price",

                                }

                            ],



                            [

                                {

                                    text:

                                        "⬅️ بازگشت به بازار",


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