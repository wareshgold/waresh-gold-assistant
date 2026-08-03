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
    GoldCalculationStep
}
from "../../../gold/workflows/GoldCalculationStep";


import {
    GoldCalculationSessionData
}
from "../../../gold/workflows/GoldCalculationSessionData";







export class CalculateGoldPriceCallbackHandler

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









        const currentPrice =

            await this.getCurrentGoldPriceUseCase.execute();









        session.data = {


            ...session.data,


            goldPrice:

                currentPrice.price



        };







        session.state =

            GoldCalculationStep.WAITING_LABOR;







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

${this.formatNumber(currentPrice.price)} تومان


📈 درصد اجرت را وارد کنید:
`.trim()



        };


    }









    private formatNumber(

        value:

            number

    ): string {


        return new Intl.NumberFormat(

            "fa-IR"

        )

        .format(

            Math.round(value)

        );


    }




}