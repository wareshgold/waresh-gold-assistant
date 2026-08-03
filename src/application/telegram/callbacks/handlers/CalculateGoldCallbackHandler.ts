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


import {
    GoldCalculationStep
}
from "../../../gold/workflows/GoldCalculationStep";


import {
    createGoldCalculationSessionData
}
from "../../../gold/workflows/GoldCalculationSessionData";







export class CalculateGoldCallbackHandler

implements TelegramCallbackHandler {








    constructor(


        private readonly sessionStore:

            TelegramSessionStore


    ) {}









    canHandle(

        context:

            TelegramCallbackContext

    ):

        boolean {




        return (

            context.callback.namespace === "calculator"

            &&

            context.callback.action === "gold-price"

        );



    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {





        const userId =

            context.userId

            ??

            context.chatId;








        await this.sessionStore.save({





            userId,





            state:

                GoldCalculationStep.WAITING_WEIGHT,





            data:

                createGoldCalculationSessionData(),





            updatedAt:

                Date.now()





        });









        return {





            type:

                "text",





            content:

`
💰 محاسبه قیمت طلا


⚖️ لطفاً وزن طلا را وارد کنید:
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