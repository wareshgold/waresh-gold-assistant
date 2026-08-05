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


import {
    GoldCalculationSessionData
}
from "../../../gold/workflows/GoldCalculationSessionData";


import {
    GoldCalculationWorkflow
}
from "../../../gold/workflows/GoldCalculationWorkflow";


import {
    TelegramNumberFormatter
}
from "../../presentation/TelegramNumberFormatter";







export class CalculateGoldLivePriceCallbackHandler

implements TelegramCallbackHandler {







    constructor(


        private readonly sessionStore:

            TelegramSessionStore,


        private readonly getCurrentGoldPriceUseCase:

            GetCurrentGoldPriceUseCase,


        private readonly workflow:

            GoldCalculationWorkflow,


        private readonly numberFormatter:

            TelegramNumberFormatter


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

            context.userId

            ??

            context.chatId;








        const session =

            await this.sessionStore.get<GoldCalculationSessionData>(

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









        const currentPrice =

            await this.getCurrentGoldPriceUseCase.execute();








        const result =

            this.workflow.selectMarketPrice(

                session.data,

                currentPrice.price

            );









        session.data =

            result.updatedData!;


        session.state =

            result.nextStep!;


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

${this.numberFormatter.money(
    currentPrice.price
)}


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

                                "⬅️ اصلاح مرحله قبل",


                            actionId:

                                "calculator:back"

                        }

                    ]

                ]

            }


        };


    }






}