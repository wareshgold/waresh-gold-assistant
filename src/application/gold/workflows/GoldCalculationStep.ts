export enum GoldCalculationStep {


    WAITING_WEIGHT =
        "GOLD_CALCULATION_WAITING_WEIGHT",



    WAITING_PRICE_SELECTION =
        "GOLD_CALCULATION_WAITING_PRICE_SELECTION",



    WAITING_PRICE =
        "GOLD_CALCULATION_WAITING_PRICE",



    WAITING_LABOR =
        "GOLD_CALCULATION_WAITING_LABOR",



    WAITING_PROFIT =
        "GOLD_CALCULATION_WAITING_PROFIT",



    WAITING_TAX =
        "GOLD_CALCULATION_WAITING_TAX"




}



export const GoldCalculationPreviousStepMap:

Record<

    GoldCalculationStep,

    GoldCalculationStep | null

> = {



    [GoldCalculationStep.WAITING_WEIGHT]:

        null,



    [GoldCalculationStep.WAITING_PRICE_SELECTION]:

        GoldCalculationStep.WAITING_WEIGHT,



    [GoldCalculationStep.WAITING_PRICE]:

        GoldCalculationStep.WAITING_PRICE_SELECTION,



    [GoldCalculationStep.WAITING_LABOR]:

        GoldCalculationStep.WAITING_PRICE_SELECTION,



    [GoldCalculationStep.WAITING_PROFIT]:

        GoldCalculationStep.WAITING_LABOR,



    [GoldCalculationStep.WAITING_TAX]:

        GoldCalculationStep.WAITING_PROFIT



};





export function getPreviousGoldCalculationStep(

    step:

        GoldCalculationStep

):

GoldCalculationStep | null {


    return GoldCalculationPreviousStepMap[step];


}