import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { Spike } from "../models/Spike";
import { TwoLeg } from "../models/TwoLeg";
import { EntryLevel } from "../models/EntryLevel";

export class LevelDetector {
    detect(
        candles: StrategyACandle[],
        spike: Spike,
        twoLeg: TwoLeg
    ): EntryLevel | null {
        const completionIndex = twoLeg.completionIndex;
        const triggerIndex = completionIndex + 1;

        // The completion candle cannot confirm its own setup.
        // A separate candle must confirm the reversal.
        if (
            completionIndex < 0 ||
            completionIndex >= candles.length - 1
        ) {
            return null;
        }

        const completionCandle = candles[completionIndex];
        const confirmCandle = candles[triggerIndex];

        let confirmation = false;
        let entryPrice = twoLeg.completionPrice;

        if (spike.direction === "BUY") {
            confirmation =
                confirmCandle.close > twoLeg.completionPrice &&
                confirmCandle.close > confirmCandle.open &&
                confirmCandle.close > completionCandle.close;

            if (confirmation) {
                entryPrice = confirmCandle.close;
            }
        } else {
            confirmation =
                confirmCandle.close < twoLeg.completionPrice &&
                confirmCandle.close < confirmCandle.open &&
                confirmCandle.close < completionCandle.close;

            if (confirmation) {
                entryPrice = confirmCandle.close;
            }
        }

        if (!confirmation) {
            return null;
        }

        const spikeRange = Math.abs(
            spike.endPrice - spike.startPrice
        );

        const distanceFromSpikeEnd = Math.abs(
            entryPrice - spike.endPrice
        );

        if (
            spikeRange > 0 &&
            distanceFromSpikeEnd > spikeRange * 0.85
        ) {
            return null;
        }

        return {
            price: entryPrice,
            triggerCandleIndex: triggerIndex,
            confirmation: true
        };
    }
}
