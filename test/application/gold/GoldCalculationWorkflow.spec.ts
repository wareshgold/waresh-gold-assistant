import { describe, it, expect } from "vitest";


import {
    GoldCalculationWorkflow
}
from "../../../src/application/gold/workflows/GoldCalculationWorkflow";


import {
    GoldCalculationStep
}
from "../../../src/application/gold/workflows/GoldCalculationStep";


import {
    createGoldCalculationSessionData
}
from "../../../src/application/gold/workflows/GoldCalculationSessionData";


import {
    GoldCalculationValidator
}
from "../../../src/application/gold/validation/GoldCalculationValidator";


import {
    CalculateGoldFormulaUseCase
}
from "../../../src/application/gold/CalculateGoldFormulaUseCase";


import {
    GoldCalculationHistoryManager
}
from "../../../src/application/gold/workflows/GoldCalculationHistoryManager";



class FakeCalculateGoldFormulaUseCase
extends CalculateGoldFormulaUseCase {


    constructor() {

        super({} as any);

    }



    override execute() {

        return {

            goldValue: 90000000,

            labor: 5000000,

            profit: 7000000,

            tax: 0,

            finalPrice: 102000000

        };

    }

}



describe(
    "GoldCalculationWorkflow",
    () => {



        const createWorkflow = () => {


            return new GoldCalculationWorkflow(

                new FakeCalculateGoldFormulaUseCase(),

                new GoldCalculationValidator(),

                new GoldCalculationHistoryManager()

            );


        };





        it(
            "should move from weight to price selection",
            () => {


                const workflow =
                    createWorkflow();



                const result =
                    workflow.execute(

                        GoldCalculationStep.WAITING_WEIGHT,

                        createGoldCalculationSessionData(),

                        5

                    );



                expect(
                    result.nextStep
                )
                .toBe(
                    GoldCalculationStep.WAITING_PRICE_SELECTION
                );



                expect(
                    result.updatedData?.weight
                )
                .toBe(5);


            }
        );








        it(
            "should select market price",
            () => {


                const workflow =
                    createWorkflow();



                const result =
                    workflow.selectMarketPrice(

                        createGoldCalculationSessionData(),

                        18000000

                    );



                expect(
                    result.nextStep
                )
                .toBe(
                    GoldCalculationStep.WAITING_LABOR
                );



                expect(
                    result.updatedData?.goldPrice
                )
                .toBe(18000000);



                expect(
                    result.updatedData?.priceSource
                )
                .toBe("MARKET");


            }
        );








        it(
            "should select manual price",
            () => {


                const workflow =
                    createWorkflow();



                const result =
                    workflow.selectManualPrice(

                        createGoldCalculationSessionData()

                    );



                expect(
                    result.nextStep
                )
                .toBe(
                    GoldCalculationStep.WAITING_PRICE
                );



                expect(
                    result.updatedData?.priceSource
                )
                .toBe("MANUAL");


            }
        );









        it(
            "should go back to previous step",
            () => {


                const workflow =
                    createWorkflow();



                const data =
                    createGoldCalculationSessionData();



                const first =
                    workflow.execute(

                        GoldCalculationStep.WAITING_WEIGHT,

                        data,

                        5

                    );



                const second =
                    workflow.execute(

                        first.nextStep!,

                        first.updatedData!,

                        18000000

                    );



                const result =
                    workflow.goBack(

                        second.updatedData!

                    );



                expect(
                    result.nextStep
                )
                .toBe(
                    GoldCalculationStep.WAITING_PRICE_SELECTION
                );


            }
        );









        it(
            "should calculate completed result",
            () => {


                const workflow =
                    createWorkflow();



                let data =
                    createGoldCalculationSessionData();



                data.weight = 5;

                data.goldPrice = 18000000;

                data.priceSource = "MANUAL";

                data.laborPercent = 15;

                data.profitPercent = 7;

                data.taxPercent = 0;




                const result =
                    workflow.execute(

                        GoldCalculationStep.WAITING_TAX,

                        data,

                        0

                    );



                expect(
                    result.completed
                )
                .toBe(true);



                expect(
                    result.result?.finalPrice
                )
                .toBe(102000000);


            }
        );



    }
);