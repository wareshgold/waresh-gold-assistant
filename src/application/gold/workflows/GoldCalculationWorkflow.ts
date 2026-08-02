import {
    CalculateGoldFormulaUseCase,
    CalculateGoldFormulaOutput
}
from "../CalculateGoldFormulaUseCase";


import {
    GoldCalculationStep
}
from "./GoldCalculationStep";


import {
    GoldCalculationSessionData
}
from "./GoldCalculationSessionData";


import {
    GoldCalculationValidator
}
from "../validation/GoldCalculationValidator";




export interface GoldCalculationWorkflowResult {


    completed: boolean;


    nextStep?: GoldCalculationStep;


    updatedData?: GoldCalculationSessionData;


    error?: string[];


    result?: CalculateGoldFormulaOutput;


}




export class GoldCalculationWorkflow {



    constructor(


        private readonly useCase:

            CalculateGoldFormulaUseCase,


        private readonly validator:

            GoldCalculationValidator


    ) {}






    execute(

        step: GoldCalculationStep,

        data: GoldCalculationSessionData,

        value: number

    ): GoldCalculationWorkflowResult {



        const updatedData: GoldCalculationSessionData = {


            ...data


        };






        switch(step) {



            case GoldCalculationStep.WAITING_WEIGHT:


                updatedData.weight = value;


                return {


                    completed: false,


                    nextStep:

                        GoldCalculationStep.WAITING_PRICE,


                    updatedData


                };






            case GoldCalculationStep.WAITING_PRICE:


                updatedData.goldPrice = value;


                return {


                    completed: false,


                    nextStep:

                        GoldCalculationStep.WAITING_LABOR,


                    updatedData


                };






            case GoldCalculationStep.WAITING_LABOR:


                updatedData.laborPercent = value;


                return {


                    completed: false,


                    nextStep:

                        GoldCalculationStep.WAITING_PROFIT,


                    updatedData


                };






            case GoldCalculationStep.WAITING_PROFIT:


                updatedData.profitPercent = value;


                return {


                    completed: false,


                    nextStep:

                        GoldCalculationStep.WAITING_TAX,


                    updatedData


                };






            case GoldCalculationStep.WAITING_TAX: {



                updatedData.taxPercent = value;






                const validation =

                    this.validator.validate(

                        updatedData

                    );






                if (!validation.valid) {


                    return {


                        completed: false,


                        updatedData,


                        error:

                            validation.errors


                    };


                }






                const result =

                    this.useCase.execute({



                        weight:

                            updatedData.weight as number,



                        goldPrice:

                            updatedData.goldPrice as number,



                        laborPercent:

                            updatedData.laborPercent as number,



                        profitPercent:

                            updatedData.profitPercent as number,



                        taxPercent:

                            updatedData.taxPercent ?? 0,



                        discount:

                            updatedData.discount ?? 0


                    });






                return {


                    completed: true,


                    updatedData,


                    result


                };


            }



        }


    }


}