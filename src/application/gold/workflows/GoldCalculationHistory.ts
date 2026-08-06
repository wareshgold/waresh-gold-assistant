import {
    GoldCalculationStep
}
from "./GoldCalculationStep";


import {
    GoldCalculationPriceSource
}
from "./GoldCalculationSessionData";



export interface GoldCalculationSnapshot {


    weight: number | null;


    goldPrice: number | null;


    priceSource: GoldCalculationPriceSource | null;


    laborPercent: number | null;


    profitPercent: number | null;


    taxPercent: number | null;


    discount: number | null;


}



export interface GoldCalculationHistoryEntry {


    step: GoldCalculationStep;


    data: GoldCalculationSnapshot;


}