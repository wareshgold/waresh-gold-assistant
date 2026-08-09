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



export class CalculateGoldManualPriceCallbackHandler

implements TelegramCallbackHandler {



    constructor(


        private readonly sessionStore:
            TelegramSessionStore,


        private readonly workflow:
            GoldCalculationWorkflow


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









        const result =

            this.workflow.selectManualPrice(

                session.data

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

                "✍️ لطفاً قیمت هر گرم طلا را وارد کنید:",



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