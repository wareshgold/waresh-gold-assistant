import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyAConfiguration } from "../value-objects/StrategyAConfiguration";
import { Spike } from "../models/Spike";
import { TwoLeg, SwingLeg } from "../models/TwoLeg";

export class TwoLegDetector {
    detect(candles: StrategyACandle[], spike: Spike, config: StrategyAConfiguration): TwoLeg | null {
        const afterStart = spike.endIndex + 1;
        if (afterStart >= candles.length - 2) return null;

        return spike.direction === "BUY"
            ? this.detectBullishCorrection(candles, spike, afterStart, config)
            : this.detectBearishCorrection(candles, spike, afterStart, config);
    }

    private detectBullishCorrection(candles: StrategyACandle[], spike: Spike, fromIndex: number, config: StrategyAConfiguration): TwoLeg | null {
        const leg1End = this.findSwingLowIndex(candles, fromIndex, candles.length - 1);
        if (leg1End === null || leg1End <= fromIndex) return null;
        const leg1: SwingLeg = { startIndex: fromIndex, endIndex: leg1End, startPrice: candles[fromIndex].high, endPrice: candles[leg1End].low };

        const bounceEnd = this.findSwingHighIndex(candles, leg1End + 1, candles.length - 1);
        if (bounceEnd === null || bounceEnd <= leg1End) return null;
        const leg2End = this.findSwingLowIndex(candles, bounceEnd + 1, candles.length - 1);
        if (leg2End === null || leg2End <= bounceEnd) return null;
        const leg2: SwingLeg = { startIndex: bounceEnd, endIndex: leg2End, startPrice: candles[bounceEnd].high, endPrice: candles[leg2End].low };

        return this.buildTwoLeg(spike, leg1, leg2, config);
    }

    private detectBearishCorrection(candles: StrategyACandle[], spike: Spike, fromIndex: number, config: StrategyAConfiguration): TwoLeg | null {
        const leg1End = this.findSwingHighIndex(candles, fromIndex, candles.length - 1);
        if (leg1End === null || leg1End <= fromIndex) return null;
        const leg1: SwingLeg = { startIndex: fromIndex, endIndex: leg1End, startPrice: candles[fromIndex].low, endPrice: candles[leg1End].high };

        const dipEnd = this.findSwingLowIndex(candles, leg1End + 1, candles.length - 1);
        if (dipEnd === null || dipEnd <= leg1End) return null;
        const leg2End = this.findSwingHighIndex(candles, dipEnd + 1, candles.length - 1);
        if (leg2End === null || leg2End <= dipEnd) return null;
        const leg2: SwingLeg = { startIndex: dipEnd, endIndex: leg2End, startPrice: candles[dipEnd].low, endPrice: candles[leg2End].high };

        return this.buildTwoLeg(spike, leg1, leg2, config);
    }

    private buildTwoLeg(spike: Spike, leg1: SwingLeg, leg2: SwingLeg, config: StrategyAConfiguration): TwoLeg | null {
        const spikeRange = Math.abs(spike.endPrice - spike.startPrice);
        if (spikeRange <= 0) return null;
        const completionPrice = leg2.endPrice;
        const retraced = spike.direction === "BUY" ? spike.endPrice - completionPrice : completionPrice - spike.endPrice;
        const retracementPercent = (retraced / spikeRange) * 100;
        if (retracementPercent < config.minRetracementPercent || retracementPercent > config.maxRetracementPercent) return null;
        return { leg1, leg2, retracementPercent, completionPrice, completionIndex: leg2.endIndex };
    }

    private findSwingLowIndex(candles: StrategyACandle[], from: number, to: number): number | null {
        if (from > to || from >= candles.length) return null;
        let minIdx = from;
        for (let i = from + 1; i <= Math.min(to, candles.length - 1); i++) if (candles[i].low < candles[minIdx].low) minIdx = i;
        return minIdx;
    }

    private findSwingHighIndex(candles: StrategyACandle[], from: number, to: number): number | null {
        if (from > to || from >= candles.length) return null;
        let maxIdx = from;
        for (let i = from + 1; i <= Math.min(to, candles.length - 1); i++) if (candles[i].high > candles[maxIdx].high) maxIdx = i;
        return maxIdx;
    }
}
