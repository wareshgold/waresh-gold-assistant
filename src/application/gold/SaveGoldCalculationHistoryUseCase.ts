import {
    GoldCalculationHistory,
    GoldCalculationInputSnapshot,
    GoldCalculationResultSnapshot
}
from "../../domain/gold/entities/GoldCalculationHistory";


import {
    GoldCalculationHistoryRepository
}
from "../../domain/gold/repositories/GoldCalculationHistoryRepository";


import {
    CalculateGoldFormulaOutput
}
from "./CalculateGoldFormulaUseCase";


import {
    GoldCalculationSessionData
}
from "./workflows/GoldCalculationSessionData";




export class SaveGoldCalculationHistoryUseCase {



    constructor(

        private readonly repository:

            GoldCalculationHistoryRepository

    ) {}






    async execute(

        userId: string,

        input: GoldCalculationSessionData,

        result: CalculateGoldFormulaOutput

    ): Promise<void> {



        const inputSnapshot:

            GoldCalculationInputSnapshot = {


                weight:

                    input.weight ?? undefined,


                goldPrice:

                    input.goldPrice ?? undefined,


                laborPercent:

                    input.laborPercent ?? undefined,


                profitPercent:

                    input.profitPercent ?? undefined,


                taxPercent:

                    input.taxPercent ?? undefined,


                discount:

                    input.discount ?? undefined


            };






        const resultSnapshot:

            GoldCalculationResultSnapshot = {


                goldValue:

                    result.goldValue,


                labor:

                    result.labor,


                profit:

                    result.profit,


                tax:

                    result.tax,


                finalPrice:

                    result.finalPrice


            };







        const history =

            new GoldCalculationHistory(


                userId,


                inputSnapshot,


                resultSnapshot


            );






        await this.repository.save(

            history

        );

    }


}