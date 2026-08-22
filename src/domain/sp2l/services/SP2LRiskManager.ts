import { Spike } from "../models/Spike";
import { EntryLevel } from "../models/EntryLevel";
import { StopLoss } from "../models/StopLoss";
import { TakeProfit } from "../models/TakeProfit";
import { SP2LConfiguration } from "../value-objects/SP2LConfiguration";

export interface RiskPlan {
    stopLoss: StopLoss;
    takeProfit: TakeProfit;
}

export interface TakeProfitCalculator {
    calculateTarget(
        entryPrice: number,
        stopLossPrice: number,
        direction: "BUY" | "SELL",
        riskReward: number
    ): TakeProfit;
}

export class FixedRiskRewardTakeProfitCalculator implements TakeProfitCalculator {
    calculateTarget(entryPrice: number, stopLossPrice: number, direction: "BUY" | "SELL", riskReward: number): TakeProfit {
        const distance = Math.abs(entryPrice - stopLossPrice);
        const targetDistance = distance * riskReward;
        const price = direction === "BUY"
            ? entryPrice + targetDistance
            : entryPrice - targetDistance;
        return { price, riskReward };
    }
}

export class SP2LRiskManager {
    constructor(
        private readonly takeProfitCalculator: TakeProfitCalculator =
            new FixedRiskRewardTakeProfitCalculator()
    ) {}

    buildPlan(spike: Spike, entry: EntryLevel, config: SP2LConfiguration): RiskPlan {
        const stopLoss = this.calculateStopLoss(spike, entry.price);
        const takeProfit = this.takeProfitCalculator.calculateTarget(
            entry.price,
            stopLoss.price,
            spike.direction,
            config.riskReward
        );
        return { stopLoss, takeProfit };
    }

    private calculateStopLoss(spike: Spike, entryPrice: number): StopLoss {
        const price = spike.direction === "BUY"
            ? spike.extremeLow
            : spike.extremeHigh;
        return {
            price,
            distance: Math.abs(entryPrice - price)
        };
    }
}
