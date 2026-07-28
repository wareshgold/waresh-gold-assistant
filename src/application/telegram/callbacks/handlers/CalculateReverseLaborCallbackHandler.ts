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




export class CalculateReverseLaborCallbackHandler

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

            context.callback.namespace === "calculator"

            &&

            context.callback.action === "reverse-labor"

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

                "REVERSE_LABOR_CALCULATION_WAITING_PRICE",



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
🔄 محاسبه معکوس طلا


قیمت نهایی فاکتور را وارد کنید:
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