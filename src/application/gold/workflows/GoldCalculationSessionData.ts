import {
    GoldCalculationHistoryEntry,
    GoldCalculationPriceSource
}
from "./GoldCalculationHistory";


export interface GoldCalculationSessionData {

    weight:
        number | null;


    goldPrice:
        number | null;


    priceSource:
        GoldCalculationPriceSource | null;


    laborPercent:
        number | null;


    profitPercent:
        number | null;


    taxPercent:
        number | null;


    discount:
        number | null;


    history:
        GoldCalculationHistoryEntry[];

}


export interface ValidatedGoldCalculationData {

    weight:
        number;


    goldPrice:
        number;


    priceSource:
        GoldCalculationPriceSource;


    laborPercent:
        number;


    profitPercent:
        number;


    taxPercent:
        number;


    discount:
        number;


    history:
        GoldCalculationHistoryEntry[];

}


export function createGoldCalculationSessionData():

GoldCalculationSessionData {

    return {

        weight:
            null,


        goldPrice:
            null,


        priceSource:
            null,


        laborPercent:
            null,


        profitPercent:
            null,


        taxPercent:
            null,


        discount:
            null,


        history:

            []

    };

}
