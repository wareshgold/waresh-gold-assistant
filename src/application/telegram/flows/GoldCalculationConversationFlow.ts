import { TelegramConversationFlow } from "./TelegramConversationFlow";
import { TelegramSessionStore } from "../state/TelegramSessionStore";
import { CalculateGoldFormulaUseCase } from "../../gold/CalculateGoldFormulaUseCase";


export class GoldCalculationConversationFlow
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


        return [

            "GOLD_CALCULATION_WAITING_WEIGHT",
            "GOLD_CALCULATION_WAITING_PRICE",
            "GOLD_CALCULATION_WAITING_LABOR",
            "GOLD_CALCULATION_WAITING_PROFIT",
            "GOLD_CALCULATION_WAITING_TAX"

        ].includes(state);

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
                    "❌ لطفاً فقط عدد وارد کنید"

            };

        }



        switch (
            session.state
        ) {


            case "GOLD_CALCULATION_WAITING_WEIGHT":

                session.data.weight =
                    value;


                session.state =
                    "GOLD_CALCULATION_WAITING_PRICE";


                break;



            case "GOLD_CALCULATION_WAITING_PRICE":

                session.data.goldPrice =
                    value;


                session.state =
                    "GOLD_CALCULATION_WAITING_LABOR";


                break;



            case "GOLD_CALCULATION_WAITING_LABOR":

                session.data.laborPercent =
                    value;


                session.state =
                    "GOLD_CALCULATION_WAITING_PROFIT";


                break;



            case "GOLD_CALCULATION_WAITING_PROFIT":

                session.data.profitPercent =
                    value;


                session.state =
                    "GOLD_CALCULATION_WAITING_TAX";


                break;



            case "GOLD_CALCULATION_WAITING_TAX": {


                session.data.taxPercent =
                    value;



                const result =
                    this.useCase.execute({

                        weight:
                            Number(session.data.weight),

                        goldPrice:
                            Number(session.data.goldPrice),

                        laborPercent:
                            Number(session.data.laborPercent),

                        profitPercent:
                            Number(session.data.profitPercent),

                        taxPercent:
                            Number(session.data.taxPercent),

                        discount:
                            0

                    });



                await this.sessionStore.delete(
                    userId
                );



                return {

                    type: "text",

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


        }



        await this.sessionStore.save(
            session
        );



        const nextMessages: Record<string,string> = {


            GOLD_CALCULATION_WAITING_PRICE:
                "قیمت هر گرم طلا را وارد کنید:",


            GOLD_CALCULATION_WAITING_LABOR:
                "درصد اجرت را وارد کنید:",


            GOLD_CALCULATION_WAITING_PROFIT:
                "درصد سود را وارد کنید:",


            GOLD_CALCULATION_WAITING_TAX:
                "درصد مالیات را وارد کنید:"

        };



        return {

            type: "text",

            content:
                nextMessages[
                    session.state
                ]

        };


    }


}