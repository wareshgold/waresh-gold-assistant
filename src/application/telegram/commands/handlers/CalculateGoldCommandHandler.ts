import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { TelegramCommandContext } from "../TelegramCommandContext";

import {
    CalculateGoldFormulaUseCase
} from "../../../gold/CalculateGoldFormulaUseCase";

import {
    TelegramSessionStore
} from "../../state/TelegramSessionStore";


export class CalculateGoldCommandHandler
implements TelegramCommandHandler {


    constructor(

        private readonly useCase:
            CalculateGoldFormulaUseCase,


        private readonly sessionStore:
            TelegramSessionStore

    ) {}



    canHandle(
        command: string
    ): boolean {

        return command === "/calc";

    }



    async execute(

        context: TelegramCommandContext

    ): Promise<string> {



        const userId =
            context.userId ||
            context.chatId;



        if (
            context.arguments.length === 0
        ) {


            await this.sessionStore.save({

                userId,


                state:
                    "GOLD_CALCULATION_WAITING_WEIGHT",


                data:
                    {},


                updatedAt:
                    Date.now()

            });



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

        `.trim();


    }


}