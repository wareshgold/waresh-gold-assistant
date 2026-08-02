import {
    CalculateGoldFormulaUseCase
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


    error?: string[];


    result?: {

        goldValue: number;

        labor: number;

        profit: number;

        tax: number;

        finalPrice: number;

    };


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


    ):

        GoldCalculationWorkflowResult {



        switch(step) {



            case GoldCalculationStep.WAITING_WEIGHT:


                data.weight = value;


                return {

                    completed: false,

                    nextStep:

                        GoldCalculationStep.WAITING_PRICE

                };




            case GoldCalculationStep.WAITING_PRICE:


                data.goldPrice = value;


                return {

                    completed: false,

                    nextStep:

                        GoldCalculationStep.WAITING_LABOR

                };




            case GoldCalculationStep.WAITING_LABOR:


                data.laborPercent = value;


                return {

                    completed: false,

                    nextStep:

                        GoldCalculationStep.WAITING_PROFIT

                };




            case GoldCalculationStep.WAITING_PROFIT:


                data.profitPercent = value;


                return {

                    completed: false,

                    nextStep:

                        GoldCalculationStep.WAITING_TAX

                };




            case GoldCalculationStep.WAITING_TAX: {


                data.taxPercent = value;



                const validation =

                    this.validator.validate(

                        data

                    );




                if (!validation.valid) {


                    return {

                        completed: false,

                        error:

                            validation.errors

                    };

                }




                const weight = data.weight as number;

                const goldPrice = data.goldPrice as number;

                const laborPercent = data.laborPercent as number;

                const profitPercent = data.profitPercent as number;




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


                    result


                };


            }



        }


    }


}