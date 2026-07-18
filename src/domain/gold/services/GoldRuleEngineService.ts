import { GoldRuleEngine } from "./GoldRuleEngine";

import { GoldValueRule } from "../rules/GoldValueRule";
import { LaborRule } from "../rules/LaborRule";
import { ProfitRule } from "../rules/ProfitRule";
import { TaxRule } from "../rules/TaxRule";
import { FinalPriceRule } from "../rules/FinalPriceRule";


export class GoldRuleEngineService implements GoldRuleEngine {


  private readonly goldValueRule =
    new GoldValueRule();


  private readonly laborRule =
    new LaborRule();


  private readonly profitRule =
    new ProfitRule();


  private readonly taxRule =
    new TaxRule();


  private readonly finalPriceRule =
    new FinalPriceRule();



  execute(input: {

    weight: number;

    goldPrice: number;

    laborPercent: number;

    profitPercent: number;

    taxPercent: number;

    discount?: number;

  }) {


    const goldValue =
      this.goldValueRule.calculate({
        weight: input.weight,
        goldPrice: input.goldPrice,
      });



    const labor =
      this.laborRule.calculate({
        goldValue,
        laborPercent: input.laborPercent,
      });



    const profit =
      this.profitRule.calculate({
        baseAmount:
          goldValue + labor,

        profitPercent:
          input.profitPercent,
      });



    const tax =
      this.taxRule.calculate({
        baseAmount:
          labor + profit,

        taxPercent:
          input.taxPercent,
      });



    const finalPrice =
      this.finalPriceRule.calculate({
        goldValue,

        labor,

        profit,

        tax,

        discount:
          input.discount ?? 0,
      });



    return {

      goldValue,

      labor,

      profit,

      tax,

      finalPrice,

    };

  }

}