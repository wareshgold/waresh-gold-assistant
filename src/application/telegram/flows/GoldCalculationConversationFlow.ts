import {
    TelegramConversationFlow
}
from "./TelegramConversationFlow";


import {
    TelegramSessionStore
}
from "../state/TelegramSessionStore";


import {
    GoldCalculationWorkflow
}
from "../../gold/workflows/GoldCalculationWorkflow";


import {
    GoldCalculationSessionData
}
from "../../gold/workflows/GoldCalculationSessionData";


import {
    GoldCalculationStep
}
from "../../gold/workflows/GoldCalculationStep";


import {
    GoldCalculationResultFormatter
}
from "../presentation/GoldCalculationResultFormatter";


import {
    GoldCalculationPromptFormatter
}
from "../presentation/GoldCalculationPromptFormatter";


import {
    SaveGoldCalculationHistoryUseCase
}
from "../../gold/SaveGoldCalculationHistoryUseCase";


import {
    GetCurrentGoldPriceUseCase
}
from "../../gold/GetCurrentGoldPriceUseCase";







export class GoldCalculationConversationFlow

implements TelegramConversationFlow {



    private readonly promptFormatter:

        GoldCalculationPromptFormatter;







    constructor(



        private readonly sessionStore:

            TelegramSessionStore,



        private readonly workflow:

            GoldCalculationWorkflow,



        private readonly resultFormatter:

            GoldCalculationResultFormatter,



        private readonly saveHistoryUseCase:

            SaveGoldCalculationHistoryUseCase,



        promptFormatter?:

            GoldCalculationPromptFormatter,



        private readonly getCurrentGoldPriceUseCase?:

            GetCurrentGoldPriceUseCase



    ) {


        this.promptFormatter =

            promptFormatter

            ??

            new GoldCalculationPromptFormatter();


    }









    canHandle(

        state:

            string

    ): boolean {


        return Object.values(

            GoldCalculationStep

        )

        .includes(

            state as GoldCalculationStep

        );


    }









    async execute(


        userId:

            string,


        message:

            string



    ): Promise<{

        type: "text";

        content: string;

        metadata?: Record<string, unknown>;

        replyMarkup?: unknown;

    }> {



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









        const normalizedMessage =

            message.trim().toLowerCase();







        if (

            normalizedMessage === "back"

            ||

            normalizedMessage === "بازگشت"

            ||

            normalizedMessage === "⬅️ اصلاح"

            ||

            normalizedMessage === "اصلاح"

        ) {



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







            session.state =

                result.nextStep!;



            session.data =

                result.updatedData!;



            session.updatedAt =

                Date.now();







            await this.sessionStore.save(

                session

            );








            const prompt =

                this.promptFormatter.format(

                    result.nextStep!

                );







            return {


                type:

                    "text",


                content:

                    `⬅️ به مرحله قبل برگشتید\n\n${prompt.text}`,


                replyMarkup:

                    prompt.replyMarkup


            };


        }









        const createPromptResponse =

            (

                step:

                    GoldCalculationStep

            ) => {


                const prompt =

                    this.promptFormatter.format(

                        step

                    );


                return {


                    type:

                        "text" as const,


                    content:

                        prompt.text,


                    replyMarkup:

                        prompt.replyMarkup


                };


            };









        switch (

            session.state as GoldCalculationStep

        ) {



            case GoldCalculationStep.WAITING_PRICE_SELECTION: {



                if (

                    message === "MARKET"

                    ||

                    message === "بازار"

                ) {



                    if (!this.getCurrentGoldPriceUseCase) {


                        return {


                            type:

                                "text",


                            content:

                                "❌ سرویس قیمت بازار فعال نیست"


                        };


                    }







                    const marketPrice =

                        await this.getCurrentGoldPriceUseCase.execute();







                    const result =

                        this.workflow.selectMarketPrice(

                            session.data,

                            marketPrice.price

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







                    return createPromptResponse(

                        result.nextStep!

                    );


                }









                if (

                    message === "MANUAL"

                    ||

                    message === "دستی"

                ) {



                    const result =

                        this.workflow.selectManualPrice(

                            session.data

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







                    return createPromptResponse(

                        result.nextStep!

                    );


                }







                return {


                    type:

                        "text",


                    content:

                        "لطفاً یکی از گزینه‌های قیمت بازار یا دستی را انتخاب کنید"


                };


            }



        }









        const value =

            Number(

                message

            );







        if (

            Number.isNaN(value)

        ) {


            return {


                type:

                    "text",


                content:

                    "❌ لطفاً فقط عدد وارد کنید"


            };


        }









        const result =

            this.workflow.execute(


                session.state as GoldCalculationStep,


                session.data,


                value


            );









        if (result.error) {


            return {


                type:

                    "text",


                content:

                    result.error.join("\n")


            };


        }









        if (result.completed) {




            const response = {


                type:

                    "text" as const,


                content:

                    this.resultFormatter.format(

                        result.result!

                    )


            };








            try {


                await this.saveHistoryUseCase.execute(


                    userId,


                    result.updatedData!,


                    result.result!


                );


            }

            catch(error) {


                console.error(


                    "GOLD CALCULATION HISTORY SAVE FAILED",


                    error


                );


            }








            await this.sessionStore.delete(

                userId

            );








            return response;


        }









        session.state =

            result.nextStep!;



        session.data =

            result.updatedData!;



        session.updatedAt =

            Date.now();








        await this.sessionStore.save(

            session

        );








        return createPromptResponse(

            result.nextStep!

        );


    }


}