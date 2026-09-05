import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { Spike } from "../models/Spike";
import { TwoLeg } from "../models/TwoLeg";
import { EntryLevel } from "../models/EntryLevel";

export class LevelDetector {
    detect(
        candles: StrategyACandle[],
        _spike: Spike,
        twoLeg: TwoLeg
    ): EntryLevel | null {
        const completionIndex = twoLeg.completionIndex;

        if (
            completionIndex < 0 ||
            completionIndex >= candles.length
        ) {
            return null;
        }

        // Strategy A enters as soon as the second leg completes.
        // There is intentionally no additional confirmation candle.
        return {
            price: twoLeg.completionPrice,
            triggerCandleIndex: completionIndex,
            confirmation: true
        };
    }
}
