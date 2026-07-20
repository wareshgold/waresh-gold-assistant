import { TelegramCommandHandler } from "../TelegramCommandHandler";
import { TelegramCommandContext } from "../TelegramCommandContext";
import {
    CalculateGoldFormulaUseCase
} from "../../../gold/CalculateGoldFormulaUseCase";


export class CalculateGoldCommandHandler
implements TelegramCommandHandler {


    constructor(
        private readonly useCase: CalculateGoldFormulaUseCase
    ) {}



    canHandle(
        command: string
    ): boolean {

        return command === "/calc";

    }



    async execute(
        context: TelegramCommandContext
    ): Promise<string> {


        const result =
            this.useCase.execute({

                weight: 5,

                goldPrice: 18000000,

                laborPercent: 15,

                profitPercent: 7,

                taxPercent: 9,

                discount: 0

            });



        return `
💰 محاسبه طلا

وزن: 5 گرم

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