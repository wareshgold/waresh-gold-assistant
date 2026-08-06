import { describe, expect, it } from "vitest";


import {
    GoldCalculationWorkflow
}
from "./GoldCalculationWorkflow";


import {
    createGoldCalculationSessionData
}
from "./GoldCalculationSessionData";


import {
    GoldCalculationStep
}
from "./GoldCalculationStep";


import {
    CalculateGoldFormulaUseCase
}
from "../CalculateGoldFormulaUseCase";


import {
    GoldCalculationValidator
}
from "../validation/GoldCalculationValidator";


import {
    GoldCalculationHistoryManager
}
from "./GoldCalculationHistoryManager";


import {
    createGoldRuleEngine
}
from "../../../domain/gold/services/createGoldRuleEngine";




function createWorkflow() {


    const useCase =

        new CalculateGoldFormulaUseCase(

            createGoldRuleEngine()

        );



    return new GoldCalculationWorkflow(


        useCase,


        new GoldCalculationValidator(),


        new GoldCalculationHistoryManager()


    );


}





describe(
    "GoldCalculationWorkflow",
    ()=>{


        it(
            "should move through calculation steps",
            ()=>{


                const workflow =

                    createWorkflow();



                let session =

                    createGoldCalculationSessionData();




                const weightResult =

                    workflow.execute(


                        GoldCalculationStep.WAITING_WEIGHT,


                        session,


                        5


                    );



                expect(

                    weightResult.nextStep

                )
                .toBe(

                    GoldCalculationStep.WAITING_PRICE_SELECTION

                );



                session =

                    weightResult.updatedData!;



                const manualPriceResult =

                    workflow.selectManualPrice(

                        session

                    );



                expect(

                    manualPriceResult.nextStep

                )
                .toBe(

                    GoldCalculationStep.WAITING_PRICE

                );



            }

        );






        it(
            "should go back to previous step and restore previous snapshot",
            ()=>{


                const workflow =

                    createWorkflow();



                let session =

                    createGoldCalculationSessionData();




                let result =

                    workflow.execute(


                        GoldCalculationStep.WAITING_WEIGHT,


                        session,


                        5


                    );



                session =

                    result.updatedData!;



                result =

                    workflow.selectManualPrice(

                        session

                    );



                session =

                    result.updatedData!;




                result =

                    workflow.execute(


                        GoldCalculationStep.WAITING_PRICE,


                        session,


                        18000000


                    );



                session =

                    result.updatedData!;



                const backResult =

                    workflow.goBack(

                        session

                    );



                expect(

                    backResult.error

                )
                .toBeUndefined();



                expect(

                    backResult.nextStep

                )
                .toBe(

                    GoldCalculationStep.WAITING_PRICE

                );



                expect(

                    backResult.updatedData?.weight

                )
                .toBe(

                    5

                );



                expect(

                    backResult.updatedData?.goldPrice

                )
                .toBeNull();



            }

        );








        it(
            "should allow correcting a previous value and continue calculation",
            ()=>{


                const workflow =

                    createWorkflow();



                let session =

                    createGoldCalculationSessionData();




                let result =

                    workflow.execute(


                        GoldCalculationStep.WAITING_WEIGHT,


                        session,


                        5


                    );



                session =

                    result.updatedData!;




                result =

                    workflow.selectManualPrice(

                        session

                    );



                session =

                    result.updatedData!;




                result =

                    workflow.execute(


                        GoldCalculationStep.WAITING_PRICE,


                        session,


                        18000000


                    );



                session =

                    result.updatedData!;




                result =

                    workflow.execute(


                        GoldCalculationStep.WAITING_LABOR,


                        session,


                        10


                    );



                session =

                    result.updatedData!;




                const backResult =

                    workflow.goBack(

                        session

                    );



                expect(

                    backResult.nextStep

                )
                .toBe(

                    GoldCalculationStep.WAITING_LABOR

                );



                session =

                    backResult.updatedData!;




                const correctedLaborResult =

                    workflow.execute(


                        GoldCalculationStep.WAITING_LABOR,


                        session,


                        20


                    );



                expect(

                    correctedLaborResult.nextStep

                )
                .toBe(

                    GoldCalculationStep.WAITING_PROFIT

                );



                expect(

                    correctedLaborResult.updatedData?.laborPercent

                )
                .toBe(

                    20

                );



            }

        );








        it(
            "should return error when there is no history",
            ()=>{


                const workflow =

                    createWorkflow();




                const result =

                    workflow.goBack(


                        createGoldCalculationSessionData()


                    );



                expect(

                    result.error

                )
                .toEqual(


                    [

                        "مرحله قبلی وجود ندارد"

                    ]


                );



            }

        );



    }

);