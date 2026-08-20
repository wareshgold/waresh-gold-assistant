import {
    SP2LCandle
} from "../../../domain/sp2l/value-objects/SP2LMarketData";

import {
    SP2LConfiguration
} from "../../../domain/sp2l/value-objects/SP2LConfiguration";

import {
    Spike
} from "../../../domain/sp2l/models/Spike";

import {
    TwoLeg,
    SwingLeg
} from "../../../domain/sp2l/models/TwoLeg";

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
        // Leg1: first decline from spike end
        const leg1End =
            this.findSwingLowIndex(
                candles,
                fromIndex,
                candles.length - 1
            );

        if (
            leg1End === null ||
            leg1End <= fromIndex
        ) {
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

        // Small bounce then Leg2 lower/equal
        const bounceEnd =
            this.findSwingHighIndex(
                candles,
                leg1End + 1,
                candles.length - 1
            );

        if (
            bounceEnd === null ||
            bounceEnd <= leg1End
        ) {
            return null;
        }

        const leg2End =
            this.findSwingLowIndex(
                candles,
                bounceEnd + 1,
                candles.length - 1
            );

        if (
            leg2End === null ||
            leg2End <= bounceEnd
        ) {
            return null;
        }

        const leg2: SwingLeg = {
            startIndex: bounceEnd,
            endIndex: leg2End,
            startPrice:
                candles[bounceEnd].high,
            endPrice:
                candles[leg2End].low
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
        const leg1End =
            this.findSwingHighIndex(
                candles,
                fromIndex,
                candles.length - 1
            );

        if (
            leg1End === null ||
            leg1End <= fromIndex
        ) {
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

        const dipEnd =
            this.findSwingLowIndex(
                candles,
                leg1End + 1,
                candles.length - 1
            );

        if (
            dipEnd === null ||
            dipEnd <= leg1End
        ) {
            return null;
        }

        const leg2End =
            this.findSwingHighIndex(
                candles,
                dipEnd + 1,
                candles.length - 1
            );

        if (
            leg2End === null ||
            leg2End <= dipEnd
        ) {
            return null;
        }

        const leg2: SwingLeg = {
            startIndex: dipEnd,
            endIndex: leg2End,
            startPrice:
                candles[dipEnd].low,
            endPrice:
                candles[leg2End].high
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

    private findSwingLowIndex(
        candles: SP2LCandle[],
        from: number,
        to: number
    ): number | null {
        if (from > to || from >= candles.length) {
            return null;
        }

        let minIdx = from;
        let minVal = candles[from].low;

        for (
            let i = from;
            i <= Math.min(to, candles.length - 1);
            i++
        ) {
            if (candles[i].low < minVal) {
                minVal = candles[i].low;
                minIdx = i;
            }
        }

        return minIdx;
    }

    private findSwingHighIndex(
        candles: SP2LCandle[],
        from: number,
        to: number
    ): number | null {
        if (from > to || from >= candles.length) {
            return null;
        }

        let maxIdx = from;
        let maxVal = candles[from].high;

        for (
            let i = from;
            i <= Math.min(to, candles.length - 1);
            i++
        ) {
            if (candles[i].high > maxVal) {
                maxVal = candles[i].high;
                maxIdx = i;
            }
        }

        return maxIdx;
    }
}