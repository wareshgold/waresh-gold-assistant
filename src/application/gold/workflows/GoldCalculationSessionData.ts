export type GoldCalculationPriceSource =
    | "MANUAL"
    | "MARKET";





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

            null



    };



}