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





export interface GoldCalculationWorkflowResult {


    completed: boolean;


    nextStep?: GoldCalculationStep;


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

            CalculateGoldFormulaUseCase

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





                const result =

                    this.useCase.execute({


                        weight:

                            data.weight,


                        goldPrice:

                            data.goldPrice,


                        laborPercent:

                            data.laborPercent,


                        profitPercent:

                            data.profitPercent,


                        taxPercent:

                            data.taxPercent ?? 0,


                        discount:

                            0


                    });






                return {


                    completed: true,


                    result


                };


            }



        }


    }



}