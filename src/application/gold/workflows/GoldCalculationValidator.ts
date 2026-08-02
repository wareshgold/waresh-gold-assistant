import {
    GoldCalculationSessionData
}
from "./GoldCalculationSessionData";



export class GoldCalculationValidator {



    validate(
        data: GoldCalculationSessionData
    ): void {


        if (
            data.weight === undefined ||
            data.goldPrice === undefined ||
            data.laborPercent === undefined ||
            data.profitPercent === undefined
        ) {


            throw new Error(
                "Incomplete gold calculation data"
            );


        }


    }


}