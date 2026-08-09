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
    GoldCalculationStep
}
from "../../../gold/workflows/GoldCalculationStep";


import {
    GoldCalculationWorkflow
}
from "../../../gold/workflows/GoldCalculationWorkflow";


import {
    TelegramNumberFormatter
}
from "../../presentation/TelegramNumberFormatter";



export class CalculateGoldPriceCallbackHandler

implements TelegramCallbackHandler {



    constructor(


        private readonly sessionStore:
            TelegramSessionStore,


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

            context.callback.action === "price"

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

            await this.sessionStore.get<
                GoldCalculationSessionData,
                GoldCalculationStep
            >(

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







        const price =

            Number(

                context.callback.payload

            );







        if (

            Number.isNaN(price)

        ) {


            return {


                type:

                    "text",



                content:

                    "❌ قیمت وارد شده معتبر نیست"


            };


        }







        const result =

            this.workflow.execute(

                session.state,

                session.data,

                price

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

                `💰 قیمت ثبت شد:

${this.numberFormatter.money(price)}

📈 درصد اجرت را وارد کنید:`

        };


    }



}