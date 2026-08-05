import {
    TelegramConversationFlow
}
from "./TelegramConversationFlow";


import {
    TelegramSessionStore
}
from "../state/TelegramSessionStore";


import {
    CalculateReverseGoldUseCase
}
from "../../gold/CalculateReverseGoldUseCase";


import {
    TelegramNumberFormatter
}
from "../presentation/TelegramNumberFormatter";





interface ReverseGoldSessionData {


    finalPrice?: number;


    goldPrice?: number;


    weight?: number;


    profitPercent?: number;


    taxPercent?: number;


}








export class ReverseGoldConversationFlow

implements TelegramConversationFlow {



    constructor(


        private readonly sessionStore:
            TelegramSessionStore,


        private readonly useCase:
            CalculateReverseGoldUseCase,


        private readonly numberFormatter:
            TelegramNumberFormatter


    ) {}










    canHandle(

        state:
            string

    ): boolean {


        return [


            "REVERSE_LABOR_CALCULATION_WAITING_PRICE",


            "REVERSE_WAITING_GOLD_PRICE",


            "REVERSE_WAITING_WEIGHT",


            "REVERSE_WAITING_PROFIT",


            "REVERSE_WAITING_TAX"


        ].includes(state);


    }









    async execute(


        userId:
            string,


        message:
            string


    ): Promise<{


        type: "text";


        content: string;


    }> {



        const session =

            await this.sessionStore.get<
                ReverseGoldSessionData,
                string
            >(

                userId

            );





        if (!session) {


            return {


                type: "text",


                content:

                    "جلسه محاسبه معکوس پیدا نشد"


            };


        }








        const value =

            Number(message);






        if (

            Number.isNaN(value)

        ) {


            return {


                type: "text",


                content:

                    "❌ لطفاً فقط عدد وارد کنید"


            };


        }








        switch(session.state) {



            case "REVERSE_LABOR_CALCULATION_WAITING_PRICE":


                session.data.finalPrice =

                    value;


                session.state =

                    "REVERSE_WAITING_GOLD_PRICE";


                break;






            case "REVERSE_WAITING_GOLD_PRICE":


                session.data.goldPrice =

                    value;


                session.state =

                    "REVERSE_WAITING_WEIGHT";


                break;






            case "REVERSE_WAITING_WEIGHT":


                session.data.weight =

                    value;


                session.state =

                    "REVERSE_WAITING_PROFIT";


                break;






            case "REVERSE_WAITING_PROFIT":


                session.data.profitPercent =

                    value;


                session.state =

                    "REVERSE_WAITING_TAX";


                break;








            case "REVERSE_WAITING_TAX": {


                session.data.taxPercent =

                    value;





                const result =

                    this.useCase.execute({



                        target:

                            "LABOR_PERCENT",



                        finalPrice:

                            session.data.finalPrice ?? 0,



                        goldPrice:

                            session.data.goldPrice ?? 0,



                        weight:

                            session.data.weight ?? 0,



                        profitPercent:

                            session.data.profitPercent ?? 0,



                        taxPercent:

                            session.data.taxPercent ?? 0



                    });







                await this.sessionStore.delete(

                    userId

                );








                return {


                    type: "text",



                    content:



`
🔄 نتیجه محاسبه معکوس طلا


⚖️ وزن:

${this.numberFormatter.weight(
    session.data.weight ?? 0
)}


💰 قیمت هر گرم:

${this.numberFormatter.money(
    session.data.goldPrice ?? 0
)}


📈 درصد اجرت:

${result.laborPercent ?? 0}%


💵 مبلغ اجرت:

${this.numberFormatter.money(
    result.laborAmount ?? 0
)}


━━━━━━━━━━━━━━

🟡 Waresh Gold Assistant

`.trim()



                };


            }


        }








        await this.sessionStore.save(

            session

        );








        const nextMessages: Record<string,string> = {



            REVERSE_WAITING_GOLD_PRICE:

                "💰 قیمت هر گرم طلا را وارد کنید:",



            REVERSE_WAITING_WEIGHT:

                "⚖️ وزن طلا را وارد کنید:",



            REVERSE_WAITING_PROFIT:

                "📈 درصد سود را وارد کنید:",



            REVERSE_WAITING_TAX:

                "🧾 درصد مالیات را وارد کنید:"


        };








        return {


            type: "text",



            content:

                nextMessages[session.state]



        };


    }


}