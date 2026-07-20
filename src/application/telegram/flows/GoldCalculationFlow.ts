import { TelegramConversationFlow } from "./TelegramConversationFlow";
import { TelegramSessionStore } from "../state/TelegramSessionStore";
import {
    CalculateGoldFormulaUseCase
} from "../../gold/CalculateGoldFormulaUseCase";


export class GoldCalculationFlow
implements TelegramConversationFlow {


    constructor(

        private readonly sessionStore:
            TelegramSessionStore,


        private readonly useCase:
            CalculateGoldFormulaUseCase

    ) {}



    canHandle(
        state: string
    ): boolean {


        return state.startsWith(
            "GOLD_CALCULATION_"
        );

    }



    async execute(

        userId: string,

        message: string

    ): Promise<{

        type: "text";

        content: string;

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



        const data =
            session.data;



        switch(session.state) {



            case "GOLD_CALCULATION_WAITING_WEIGHT":


                await this.sessionStore.save({

                    ...session,

                    state:
                        "GOLD_CALCULATION_WAITING_PRICE",

                    data: {

                        ...data,

                        weight:
                            Number(message)

                    },

                    updatedAt:
                        Date.now()

                });


                return {

                    type:"text",

                    content:
                    "قیمت هر گرم طلا را وارد کنید"

                };





            case "GOLD_CALCULATION_WAITING_PRICE":


                await this.sessionStore.save({

                    ...session,

                    state:
                    "GOLD_CALCULATION_WAITING_LABOR",

                    data: {

                        ...data,

                        goldPrice:
                            Number(message)

                    },

                    updatedAt:
                        Date.now()

                });


                return {

                    type:"text",

                    content:
                    "درصد اجرت را وارد کنید"

                };





            case "GOLD_CALCULATION_WAITING_LABOR":


                await this.sessionStore.save({

                    ...session,

                    state:
                    "GOLD_CALCULATION_WAITING_PROFIT",

                    data: {

                        ...data,

                        laborPercent:
                            Number(message)

                    },

                    updatedAt:
                        Date.now()

                });


                return {

                    type:"text",

                    content:
                    "درصد سود را وارد کنید"

                };





            case "GOLD_CALCULATION_WAITING_PROFIT":


                await this.sessionStore.save({

                    ...session,

                    state:
                    "GOLD_CALCULATION_WAITING_TAX",

                    data: {

                        ...data,

                        profitPercent:
                            Number(message)

                    },

                    updatedAt:
                        Date.now()

                });


                return {

                    type:"text",

                    content:
                    "درصد مالیات را وارد کنید"

                };





            case "GOLD_CALCULATION_WAITING_TAX": {


                const result =
                    this.useCase.execute({

                        weight:
                            Number(data.weight),

                        goldPrice:
                            Number(data.goldPrice),

                        laborPercent:
                            Number(data.laborPercent),

                        profitPercent:
                            Number(data.profitPercent),

                        taxPercent:
                            Number(message)

                    });



                await this.sessionStore.delete(
                    userId
                );



                return {

                    type:"text",

                    content:

`
💰 نتیجه محاسبه طلا

ارزش طلا:
${result.goldValue}

اجرت:
${result.labor}

سود:
${result.profit}

مالیات:
${result.tax}

----------------

قیمت نهایی:

${result.finalPrice}
`.trim()

                };

            }


            default:


                return {

                    type:"text",

                    content:
                    "مرحله نامعتبر"

                };


        }


    }


}