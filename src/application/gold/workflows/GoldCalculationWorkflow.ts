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


        step:

            GoldCalculationStep,


        data:

            GoldCalculationSessionData,


        value:

            number


    ): GoldCalculationWorkflowResult {



        const updatedData = {


            ...data


        };





        switch(step) {



            case GoldCalculationStep.WAITING_WEIGHT:


                updatedData.weight = value;


                return this.next(

                    GoldCalculationStep.WAITING_PRICE,

                    updatedData

                );





            case GoldCalculationStep.WAITING_PRICE:


                updatedData.goldPrice = value;


                return this.next(

                    GoldCalculationStep.WAITING_LABOR,

                    updatedData

                );





            case GoldCalculationStep.WAITING_LABOR:


                updatedData.laborPercent = value;


                return this.next(

                    GoldCalculationStep.WAITING_PROFIT,

                    updatedData

                );





            case GoldCalculationStep.WAITING_PROFIT:


                updatedData.profitPercent = value;


                return this.next(

                    GoldCalculationStep.WAITING_TAX,

                    updatedData

                );





            case GoldCalculationStep.WAITING_TAX:


                updatedData.taxPercent = value;


                return this.calculate(

                    updatedData

                );





            default:


                return {


                    completed: false,


                    updatedData,


                    error: [

                        "Unknown calculation step"

                    ]

                };


        }


    }








    private next(


        step:

            GoldCalculationStep,


        data:

            GoldCalculationSessionData


    ): GoldCalculationWorkflowResult {


        return {


            completed: false,


            nextStep: step,


            updatedData: data


        };


    }









    private calculate(


        data:

            GoldCalculationSessionData


    ): GoldCalculationWorkflowResult {



        const validation =

            this.validator.validate(

                data

            );





        if (!validation.valid) {


            return {


                completed: false,


                nextStep:

                    GoldCalculationStep.WAITING_TAX,


                updatedData: data,


                error:

                    validation.errors


            };


        }







        const weight =

            data.weight!;



        const goldPrice =

            data.goldPrice!;



        const laborPercent =

            data.laborPercent!;



        const profitPercent =

            data.profitPercent!;








        const result =

            this.useCase.execute({



                weight,


                goldPrice,


                laborPercent,


                profitPercent,



                taxPercent:

                    data.taxPercent ?? 0,



                discount:

                    data.discount ?? 0


            });








        return {


            completed: true,


            updatedData: data,


            result


        };


    }



}