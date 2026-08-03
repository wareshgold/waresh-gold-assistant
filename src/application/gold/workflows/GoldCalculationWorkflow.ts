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
    GoldCalculationSessionData,
    GoldCalculationHistoryEntry,
    GoldCalculationSnapshot
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


        const updatedData = this.cloneData(data);



        this.pushHistory(

            updatedData,

            step

        );




        switch(step) {



            case GoldCalculationStep.WAITING_WEIGHT:


                updatedData.weight = value;


                return this.next(

                    GoldCalculationStep.WAITING_PRICE_SELECTION,

                    updatedData

                );





            case GoldCalculationStep.WAITING_PRICE:


                updatedData.goldPrice = value;

                updatedData.priceSource = "MANUAL";


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







    selectMarketPrice(


        data:
            GoldCalculationSessionData,


        currentPrice:
            number


    ): GoldCalculationWorkflowResult {



        const updatedData = this.cloneData(data);



        this.pushHistory(

            updatedData,

            GoldCalculationStep.WAITING_PRICE_SELECTION

        );



        updatedData.goldPrice = currentPrice;


        updatedData.priceSource = "MARKET";



        return this.next(

            GoldCalculationStep.WAITING_LABOR,

            updatedData

        );


    }







    selectManualPrice(


        data:
            GoldCalculationSessionData


    ): GoldCalculationWorkflowResult {



        const updatedData = this.cloneData(data);



        this.pushHistory(

            updatedData,

            GoldCalculationStep.WAITING_PRICE_SELECTION

        );



        updatedData.priceSource = "MANUAL";



        return this.next(

            GoldCalculationStep.WAITING_PRICE,

            updatedData

        );


    }







    goBack(


        data:
            GoldCalculationSessionData


    ): GoldCalculationWorkflowResult {



        const history = [

            ...(data.history ?? [])

        ];




        if(history.length === 0) {


            return {


                completed: false,


                updatedData: data,


                error: [

                    "مرحله قبلی وجود ندارد"

                ]


            };


        }





        const previous = history.pop()!;




        return {


            completed: false,


            nextStep: previous.step,


            updatedData: {


                ...previous.data,


                history


            }


        };


    }







    private calculate(


        data:
            GoldCalculationSessionData


    ): GoldCalculationWorkflowResult {



        const validation =

            this.validator.validate(data);




        if(!validation.valid) {


            return {


                completed: false,


                nextStep:

                    GoldCalculationStep.WAITING_TAX,


                updatedData: data,


                error:

                    validation.errors


            };


        }






        const result =

            this.useCase.execute({


                weight: data.weight!,


                goldPrice: data.goldPrice!,


                laborPercent: data.laborPercent!,


                profitPercent: data.profitPercent!,


                taxPercent: data.taxPercent ?? 0,


                discount: data.discount ?? 0


            });





        return {


            completed: true,


            updatedData: data,


            result


        };


    }







    private cloneData(

        data:
            GoldCalculationSessionData

    ): GoldCalculationSessionData {



        return {


            ...data,


            history: [

                ...(data.history ?? [])

            ]


        };


    }







    private pushHistory(


        data:
            GoldCalculationSessionData,


        step:
            GoldCalculationStep


    ): void {



        const snapshot: GoldCalculationSnapshot = {


            weight:
                data.weight,


            goldPrice:
                data.goldPrice,


            priceSource:
                data.priceSource,


            laborPercent:
                data.laborPercent,


            profitPercent:
                data.profitPercent,


            taxPercent:
                data.taxPercent,


            discount:
                data.discount


        };





        const entry: GoldCalculationHistoryEntry = {


            step,


            data: snapshot


        };



        data.history.push(entry);



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


}