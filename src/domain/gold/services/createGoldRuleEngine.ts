import { GoldRuleEngine } from "./GoldRuleEngine";

import { GoldValueRule } from "../rules/GoldValueRule";
import { LaborRule } from "../rules/LaborRule";
import { ProfitRule } from "../rules/ProfitRule";
import { TaxRule } from "../rules/TaxRule";
import { FinalPriceRule } from "../rules/FinalPriceRule";


export function createGoldRuleEngine(){

 return new GoldRuleEngine([

   new GoldValueRule(),

   new LaborRule(),

   new ProfitRule(),

   new TaxRule(),

   new FinalPriceRule()

 ]);

}