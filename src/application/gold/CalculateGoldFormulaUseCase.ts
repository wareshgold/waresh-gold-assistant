import { GoldRuleEngine } from "../../domain/gold/services/GoldRuleEngine";


export interface CalculateGoldFormulaInput {

    weight: number;

    goldPrice: number;

    laborPercent: number;

    profitPercent: number;

    taxPercent?: number;

    discount?: number;

}



export interface CalculateGoldFormulaOutput {

    goldValue: number;

    labor: number;

    profit: number;

    tax: number;

    finalPrice: number;

}



export class CalculateGoldFormulaUseCase {


    constructor(
        private readonly engine: GoldRuleEngine
    ) {}



    execute(
        input: CalculateGoldFormulaInput
    ): CalculateGoldFormulaOutput {


        return this.engine.execute({

            weight:
                input.weight,

            goldPrice:
                input.goldPrice,

            laborPercent:
                input.laborPercent,

            profitPercent:
                input.profitPercent,

            taxPercent:
                input.taxPercent ?? 0,

            discount:
                input.discount ?? 0

        });


    }

}