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
    GoldCalculationWorkflow
}
from "../../../gold/workflows/GoldCalculationWorkflow";


import {
    GoldCalculationSessionData
}
from "../../../gold/workflows/GoldCalculationSessionData";


import {
    GoldCalculationStep
}
from "../../../gold/workflows/GoldCalculationStep";


import {
    GoldCalculationPromptFormatter
}
from "../../presentation/GoldCalculationPromptFormatter";



export class BackCalculationCallbackHandler

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

            context.callback.action === "back"

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

            this.workflow.goBack(

                session.data

            );







        if (result.error) {


            return {


                type:

                    "text",



                content:

                    result.error.join("\n")


            };


        }







        session.data =

            result.updatedData!;





        session.state =

            result.nextStep!;





        session.updatedAt =

            Date.now();









        await this.sessionStore.save(

            session

        );









        const formatter =

            new GoldCalculationPromptFormatter();







        const prompt =

            formatter.format(

                result.nextStep as GoldCalculationStep

            );









        return {


            type:

                "text",



            content:

`
⬅️ به مرحله قبل برگشتید

${prompt.text}
`.trim(),



            replyMarkup:

                prompt.replyMarkup



        };


    }


}