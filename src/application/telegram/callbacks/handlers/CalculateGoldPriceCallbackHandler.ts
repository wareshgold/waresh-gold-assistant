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


import {
    GoldPriceResolver
}
from "../../../gold/pricing/GoldPriceResolver";


import {
    GoldPriceSource
}
from "../../../gold/pricing/GoldPriceSource";







export class CalculateGoldPriceCallbackHandler

implements TelegramCallbackHandler {





    constructor(


        private readonly sessionStore:
            TelegramSessionStore,


        private readonly goldPriceResolver:
            GoldPriceResolver,


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

            context.callback.action === "use-current-price"

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







        const resolvedPrice =

            await this.goldPriceResolver.resolve(

                GoldPriceSource.MARKET

            );







        const result =

            this.workflow.selectMarketPrice(

                session.data,

                resolvedPrice.price

            );






        session.state =

            result.nextStep!;


        session.data =

            result.updatedData!;


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
🟡 قیمت لحظه‌ای استفاده شد:

💰 ${this.numberFormatter.money(
    resolvedPrice.price
)}


📈 درصد اجرت را وارد کنید:
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