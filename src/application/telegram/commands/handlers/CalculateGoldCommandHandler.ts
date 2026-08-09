import {
TelegramCommandHandler
}
from "../TelegramCommandHandler";

import {
TelegramCommandContext
}
from "../TelegramCommandContext";

import {
CalculateGoldFormulaUseCase
}
from "../../../gold/CalculateGoldFormulaUseCase";

import {
TelegramSessionStore
}
from "../../state/TelegramSessionStore";

import {
TelegramNumberFormatter
}
from "../../presentation/TelegramNumberFormatter";

import {
GoldCalculationStep
}
from "../../../gold/workflows/GoldCalculationStep";

import {
createGoldCalculationSessionData
}
from "../../../gold/workflows/GoldCalculationSessionData";


export class CalculateGoldCommandHandler

implements TelegramCommandHandler {


    private readonly numberFormatter:

        TelegramNumberFormatter;



    constructor(


        private readonly useCase:

            CalculateGoldFormulaUseCase,


        private readonly sessionStore?:

            TelegramSessionStore,


        numberFormatter?:

            TelegramNumberFormatter


    ) {


        this.numberFormatter =

            numberFormatter ??

            new TelegramNumberFormatter();


    }




    metadata() {


        return {


            command:

                "/calc",


            description:

                "محاسبه قیمت طلا"


        };


    }




    canHandle(

        command:
            string

    ): boolean {


        return command === "/calc";


    }




    async execute(

        context:

            TelegramCommandContext

    ): Promise<string> {


        const userId =

            context.userId ||

            context.chatId;



        if (

            context.arguments.length === 0

        ) {


            if (this.sessionStore) {


                await this.sessionStore.save({


                    userId,


                    state:

                        GoldCalculationStep.WAITING_WEIGHT,


                    data:

                        createGoldCalculationSessionData(),


                    updatedAt:

                        Date.now()


                });


            }




            return `

💰 محاسبه طلا

لطفاً وزن طلا را وارد کنید:

`.trim();


        }




        const values =

            context.arguments.map(

                Number

            );




        if (


            values.length < 5 ||


            values.some(

                value =>

                    Number.isNaN(value)

            )


        ) {


            return `

❌ فرمت اشتباه است

فرمت صحیح:

/calc وزن قیمت_طلا اجرت سود مالیات

مثال:

/calc 5 18000000 15 7 9

`.trim();


        }




        const [

            weight,

            goldPrice,

            laborPercent,

            profitPercent,

            taxPercent


        ] = values;




        const result =


            this.useCase.execute({


                weight,


                goldPrice,


                laborPercent,


                profitPercent,


                taxPercent,


                discount:

                    0


            });





        return `

💰 محاسبه طلا


وزن:

${weight} گرم


ارزش طلا:

${this.numberFormatter.money(result.goldValue)}


اجرت:

${this.numberFormatter.money(result.labor)}


سود:

${this.numberFormatter.money(result.profit)}


مالیات:

${this.numberFormatter.money(result.tax)}


---


قیمت نهایی:

${this.numberFormatter.money(result.finalPrice)}

`.trim();


    }


}