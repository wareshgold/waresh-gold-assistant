export type ReverseCalculationTarget =
    | "GOLD_PRICE"
    | "WEIGHT";


export interface ReverseCalculationInput {

    target: ReverseCalculationTarget;


    finalPrice: number;


    goldPrice?: number;


    weight?: number;


    laborPercent: number;


    profitPercent: number;


    taxPercent?: number;


    discount?: number;

}