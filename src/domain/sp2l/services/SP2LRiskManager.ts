import { SP2LConfiguration } from "../value-objects/SP2LConfiguration";
import { EntryLevel } from "../models/EntryLevel";
import { Spike } from "../models/Spike";
import { TwoLeg } from "../models/TwoLeg";
import { RiskManagement } from "../models/RiskManagement";

export class SP2LRiskManager {
    calculate(entry: EntryLevel, spike: Spike, twoLeg: TwoLeg, config: SP2LConfiguration): RiskManagement {
        const entryPrice = entry.price;
        const riskDistance = Math.max(Math.abs(entryPrice - spike.startPrice) * config.stopLossMultiplier, Math.abs(entryPrice - spike.endPrice) * 0.5);
        const rewardDistance = riskDistance * config.riskRewardRatio;
        const stopLoss = spike.direction === "BUY" ? entryPrice - riskDistance : entryPrice + riskDistance;
        const takeProfit = spike.direction === "BUY" ? entryPrice + rewardDistance : entryPrice - rewardDistance;
        return { entryPrice, stopLoss, takeProfit, riskRewardRatio: config.riskRewardRatio };
    }
}
