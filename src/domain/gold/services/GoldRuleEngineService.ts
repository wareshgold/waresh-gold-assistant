import { GoldRuleEngine } from "./GoldRuleEngine";
import { GoldFormulaCalculator } from "./GoldFormulaCalculator";


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

            discount:
                input.discount

        });

    }

}