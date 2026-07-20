import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { TelegramCommandContext } from "../TelegramCommandContext";

import {
    CalculateGoldFormulaUseCase
} from "../../../gold/CalculateGoldFormulaUseCase";


export class CalculateGoldCommandHandler
implements TelegramCommandHandler {


    constructor(
        private readonly useCase:
            CalculateGoldFormulaUseCase
    ) {}



    canHandle(
        command: string
    ): boolean {

        return command === "/calc";

    }



    async execute(
        context: TelegramCommandContext
    ): Promise<string> {


        const values =
            context.arguments
                .map(
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

                discount: 0

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