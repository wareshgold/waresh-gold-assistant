import { GoldRuleEngine } from "./GoldRuleEngine";
import { GoldRuleEngineService } from "./GoldRuleEngineService";


export function createGoldRuleEngine(): GoldRuleEngine {

  return new GoldRuleEngineService();

}