import {
    SP2LCandle
} from "../value-objects/SP2LMarketData";

import {
    SP2LConfiguration
} from "../value-objects/SP2LConfiguration";

import {
    Spike
} from "../models/Spike";

import {
    TwoLeg,
    SwingLeg
} from "../models/TwoLeg";

export class TwoLegDetector {

    detect(
        candles: SP2LCandle[],
        spike: Spike,
        config: SP2LConfiguration
    ): TwoLeg | null {
        const afterStart =
            spike.endIndex + 1;

        if (
            afterStart >=
            candles.length - 2
        ) {
            return null;
        }

        const correction =
            candles.slice(afterStart);

        if (correction.length < 3) {
            return null;
        }

        if (spike.direction === "BUY") {
            return this.detectBullishCorrection(
                candles,
                spike,
                afterStart,
                config
            );
        }

        return this.detectBearishCorrection(
            candles,
            spike,
            afterStart,
            config
        );
    }

    private detectBullishCorrection(
        candles: SP2LCandle[],
        spike: Spike,
        fromIndex: number,
        config: SP2LConfiguration
    ): TwoLeg | null {
        let leg1End: number | null = null;

        for (
            let i = fromIndex + 1;
            i < candles.length;
            i++
        ) {
            const prev = candles[i - 1];
            const curr = candles[i];

            if (curr.low < prev.low) {
                leg1End = i;
                break;
            }
        }

        if (leg1End === null) {
            return null;
        }

        const leg1: SwingLeg = {
            startIndex: fromIndex,
            endIndex: leg1End,
            startPrice:
                candles[fromIndex].high,
            endPrice:
                candles[leg1End].low
        };

        let completionIndex = leg1End;

        for (
            let i = leg1End + 1;
            i < candles.length;
            i++
        ) {
            if (
                candles[i].low <
                candles[completionIndex].low
            ) {
                completionIndex = i;
            } else {
                break;
            }
        }

        const leg2: SwingLeg = {
            startIndex: leg1End,
            endIndex: completionIndex,
            startPrice:
                candles[leg1End].high,
            endPrice:
                candles[completionIndex].low
        };

        return this.buildTwoLeg(
            spike,
            leg1,
            leg2,
            config
        );
    }

    private detectBearishCorrection(
        candles: SP2LCandle[],
        spike: Spike,
        fromIndex: number,
        config: SP2LConfiguration
    ): TwoLeg | null {
        let leg1End: number | null = null;

        for (
            let i = fromIndex + 1;
            i < candles.length;
            i++
        ) {
            const prev = candles[i - 1];
            const curr = candles[i];

            if (curr.high > prev.high) {
                leg1End = i;
                break;
            }
        }

        if (leg1End === null) {
            return null;
        }

        const leg1: SwingLeg = {
            startIndex: fromIndex,
            endIndex: leg1End,
            startPrice:
                candles[fromIndex].low,
            endPrice:
                candles[leg1End].high
        };

        let completionIndex = leg1End;

        for (
            let i = leg1End + 1;
            i < candles.length;
            i++
        ) {
            if (
                candles[i].high >
                candles[completionIndex].high
            ) {
                completionIndex = i;
            } else {
                break;
            }
        }

        const leg2: SwingLeg = {
            startIndex: leg1End,
            endIndex: completionIndex,
            startPrice:
                candles[leg1End].low,
            endPrice:
                candles[completionIndex].high
        };

        return this.buildTwoLeg(
            spike,
            leg1,
            leg2,
            config
        );
    }

    private buildTwoLeg(
        spike: Spike,
        leg1: SwingLeg,
        leg2: SwingLeg,
        config: SP2LConfiguration
    ): TwoLeg | null {
        const spikeRange =
            Math.abs(
                spike.endPrice - spike.startPrice
            );

        if (spikeRange <= 0) {
            return null;
        }

        const completionPrice =
            leg2.endPrice;

        const retraced =
            spike.direction === "BUY"
                ? spike.endPrice - completionPrice
                : completionPrice - spike.endPrice;

        const retracementPercent =
            (retraced / spikeRange) * 100;

        if (
            retracementPercent <
                config.minRetracementPercent ||
            retracementPercent >
                config.maxRetracementPercent
        ) {
            return null;
        }

        return {
            leg1,
            leg2,
            retracementPercent,
            completionPrice,
            completionIndex:
                leg2.endIndex
        };
    }
}
