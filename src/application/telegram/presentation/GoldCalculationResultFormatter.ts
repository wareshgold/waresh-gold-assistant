import {
    CalculateGoldFormulaOutput
}
from "../../gold/CalculateGoldFormulaUseCase";


import {
    TelegramNumberFormatter
}
from "./TelegramNumberFormatter";




export class GoldCalculationResultFormatter {



    constructor(

        private readonly formatter:

            TelegramNumberFormatter

    ) {}





    format(

        result: CalculateGoldFormulaOutput

    ): string {



        return `

نتیجه محاسبه طلا:


ارزش طلا:

${this.formatter.money(result.goldValue)}



اجرت:

${this.formatter.money(result.labor)}



سود:

${this.formatter.money(result.profit)}



مالیات:

${this.formatter.money(result.tax)}



----------------



قیمت نهایی:

${this.formatter.money(result.finalPrice)}

`.trim();


    }


}