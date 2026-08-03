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
    GetCurrentGoldPriceUseCase
}
from "../../../gold/GetCurrentGoldPriceUseCase";






export class CalculateGoldLivePriceCallbackHandler

implements TelegramCallbackHandler {





    constructor(


        private readonly sessionStore:

            TelegramSessionStore,


        private readonly getCurrentGoldPriceUseCase:

            GetCurrentGoldPriceUseCase


    ) {}









    canHandle(

        context:

            TelegramCallbackContext

    ): boolean {


        return (

            context.callback.namespace === "calculator"

            &&

            context.callback.action === "live-price"

        );


    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {



        const userId =

            context.userId ?? context.chatId;







        const currentPrice =

            await this.getCurrentGoldPriceUseCase.execute();







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








        session.data = {


            ...session.data,


            goldPrice:

                currentPrice.price


        };







        session.state =

            "GOLD_CALCULATION_WAITING_LABOR";







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
✅ قیمت لحظه‌ای انتخاب شد

💰 قیمت هر گرم طلا:

${new Intl.NumberFormat("fa-IR").format(currentPrice.price)} تومان


حالا درصد اجرت را وارد کنید:
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

                    ]

                ]

            }


        };


    }



}