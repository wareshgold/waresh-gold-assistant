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







export class CalculateGoldManualPriceCallbackHandler

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



            context.callback.action === "manual-price"



        );


    }









    async execute(


        context:

            TelegramCallbackContext


    ): Promise<TelegramCommandResponse> {



        const userId =

            context.userId

            ??

            context.chatId;









        const session =

            await this.sessionStore.get(

                userId

            );







        if (!session) {


            return {


                type:

                    "text",


                content:

                    "❌ جلسه محاسبه پیدا نشد"


            };


        }









        session.state =

            GoldCalculationStep.WAITING_PRICE;



        session.updatedAt =

            Date.now();









        await this.sessionStore.save(

            session

        );









        return {


            type:

                "text",



            content:

`
✍️ لطفاً قیمت هر گرم طلا را وارد کنید:
`.trim()



        };


    }



}