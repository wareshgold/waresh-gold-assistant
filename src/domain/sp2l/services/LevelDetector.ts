import {
    SP2LCandle
} from "../value-objects/SP2LMarketData";

import {
    Spike
} from "../models/Spike";

import {
    TwoLeg
} from "../models/TwoLeg";

import {
    EntryLevel
} from "../models/EntryLevel";

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

        const confirmCandle =
            candles[candles.length - 1];

        let confirmation = false;
        let entryPrice =
            twoLeg.completionPrice;

        if (spike.direction === "BUY") {
            confirmation =
                confirmCandle.close >
                    twoLeg.completionPrice &&
                confirmCandle.close >
                    confirmCandle.open;

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
                candles.length - 1,
            confirmation: true
        };
    }
}