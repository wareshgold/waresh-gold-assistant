import {
    TelegramCallbackHandler
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext
}
from "../TelegramCallbackContext";


import {
    TelegramCommandResponse
}
from "../../commands/TelegramCommandHandler";


import {
    TelegramSessionStore
}
from "../../state/TelegramSessionStore";





export class CalculateGoldCallbackHandler

implements TelegramCallbackHandler {





    constructor(


        private readonly sessionStore:

            TelegramSessionStore


    ) {}









    canHandle(

        context:

            TelegramCallbackContext

    ): boolean {


        return (

            context.data === "calculate:gold-price"

        );


    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {





        await this.sessionStore.save({


            userId:

                context.userId ?? context.chatId,



            state:

                "GOLD_CALCULATION_WAITING_WEIGHT",



            data:

                {},



            updatedAt:

                Date.now()


        });









        return {


            type:

                "text",




            content:

`
💰 محاسبه قیمت طلا


لطفاً وزن طلا را وارد کنید:
`.trim(),





            replyMarkup:

            {

                type:

                    "INLINE",



                rows:

                [


                    [

                        {

                            text:

                                "⬅️ بازگشت",


                            actionId:

                                "menu:calculate"

                        }

                    ],



                    [

                        {

                            text:

                                "🏠 منوی اصلی",


                            actionId:

                                "menu:main"

                        }

                    ]

                ]

            }



        };

    }





}