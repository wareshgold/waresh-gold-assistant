import { TelegramConversationFlow } from "./TelegramConversationFlow";
import { TelegramSessionStore } from "../state/TelegramSessionStore";
import { GoldCalculationWorkflow } from "../../gold/workflows/GoldCalculationWorkflow";
import { GoldCalculationSessionData } from "../../gold/workflows/GoldCalculationSessionData";
import { GoldCalculationStep } from "../../gold/workflows/GoldCalculationStep";




export class GoldCalculationConversationFlow
implements TelegramConversationFlow {



    constructor(


        private readonly sessionStore:
            TelegramSessionStore,


        private readonly workflow:
            GoldCalculationWorkflow


    ) {}






    canHandle(

        state: string

    ): boolean {


        return Object.values(
            GoldCalculationStep
        ).includes(
            state as GoldCalculationStep
        );


    }








    async execute(


        userId: string,


        message: string


    ): Promise<{

        type: "text";

        content: string;

        metadata?: Record<string, unknown>;

    }> {



        const session =

            await this.sessionStore.get(

                userId

            );



        if (!session) {


            return {


                type: "text",


                content:

                    "جلسه محاسبه پیدا نشد"


            };


        }






        const value =

            Number(

                message

            );




        if (

            Number.isNaN(value)

        ) {


            return {


                type: "text",


                content:

                    "لطفا فقط عدد وارد کنید"


            };


        }







        const data =

            session.data as GoldCalculationSessionData;






        const result =

            this.workflow.execute(


                session.state as GoldCalculationStep,


                data,


                value


            );






        if (

            result.completed

        ) {



            await this.sessionStore.delete(

                userId

            );



            return {


                type: "text",


                content:

`
نتیجه محاسبه طلا:

ارزش طلا:
${result.result?.goldValue}

اجرت:
${result.result?.labor}

سود:
${result.result?.profit}

مالیات:
${result.result?.tax}


----------------

قیمت نهایی:

${result.result?.finalPrice}
`.trim()


            };


        }






        session.state =

            result.nextStep!;



        session.data =

            data as unknown as Record<string, unknown>;






        await this.sessionStore.save(

            session

        );







        const nextMessages:

            Record<GoldCalculationStep,string> = {



                [GoldCalculationStep.WAITING_PRICE]:

                    "قیمت هر گرم طلا را وارد کنید:",



                [GoldCalculationStep.WAITING_LABOR]:

                    "درصد اجرت را وارد کنید:",



                [GoldCalculationStep.WAITING_PROFIT]:

                    "درصد سود را وارد کنید:",



                [GoldCalculationStep.WAITING_TAX]:

                    "درصد مالیات را وارد کنید:",



                [GoldCalculationStep.WAITING_WEIGHT]:

                    "وزن طلا را وارد کنید:"

            };







        return {


            type: "text",


            content:

                nextMessages[

                    result.nextStep!

                ]



        };


    }


}