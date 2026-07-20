import { GoldRuleEngine } from "./GoldRuleEngine";
import { GoldFormulaCalculator } from "./GoldFormulaCalculator";
import { TaxMode } from "../value-objects/Tax";


export class GoldRuleEngineService
implements GoldRuleEngine {


    private readonly calculator =
        new GoldFormulaCalculator();



    execute(input: {

        weight: number;

        goldPrice: number;

        laborPercent: number;

        profitPercent: number;

        taxPercent: number;

        taxMode?: TaxMode;

        discount?: number;

    }) {


        return this.calculator.calculate({

            weight:
                input.weight,


            goldPrice:
                input.goldPrice,


            laborPercent:
                input.laborPercent,


            profitPercent:
                input.profitPercent,


            taxPercent:
                input.taxPercent,


            taxMode:
                input.taxMode,


            discount:
                input.discount

        });

    }

}