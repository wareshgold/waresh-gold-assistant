import {
    SP2LCandle
} from "../../../domain/sp2l/value-objects/SP2LMarketData";

import {
    Spike
} from "../../../domain/sp2l/models/Spike";

import {
    TwoLeg
} from "../../../domain/sp2l/models/TwoLeg";

import {
    EntryLevel
} from "../../../domain/sp2l/models/EntryLevel";

export class LevelDetector {

    detect(
        candles: SP2LCandle[],
        spike: Spike,
        twoLeg: TwoLeg
    ): EntryLevel | null {
        const triggerIndex =
            twoLeg.completionIndex;

        if (
            triggerIndex < 0 ||
            triggerIndex >= candles.length
        ) {
            return null;
        }

        const trigger =
            candles[triggerIndex];

        // Confirmation: last available candle closes back in spike direction
        const lastIndex =
            candles.length - 1;

        const confirmCandle =
            candles[lastIndex];

        let confirmation = false;
        let entryPrice =
            twoLeg.completionPrice;

        if (spike.direction === "BUY") {
            confirmation =
                confirmCandle.close >
                    twoLeg.completionPrice &&
                confirmCandle.close >
                    confirmCandle.open;

            // Entry on reclaim of completion level
            entryPrice =
                Math.max(
                    twoLeg.completionPrice,
                    confirmCandle.close
                );
        } else {
            confirmation =
                confirmCandle.close <
                    twoLeg.completionPrice &&
                confirmCandle.close <
                    confirmCandle.open;

            entryPrice =
                Math.min(
                    twoLeg.completionPrice,
                    confirmCandle.close
                );
        }

        if (!confirmation) {
            return null;
        }

        // Level must still relate to spike structure (not runaway)
        const spikeRange =
            Math.abs(
                spike.endPrice - spike.startPrice
            );

        const distanceFromSpikeEnd =
            Math.abs(
                entryPrice - spike.endPrice
            );

        if (
            spikeRange > 0 &&
            distanceFromSpikeEnd >
                spikeRange * 0.85
        ) {
            return null;
        }

        return {
            price: entryPrice,
            triggerCandleIndex:
                lastIndex,
            confirmation: true
        };
    }
}