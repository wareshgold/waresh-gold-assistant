import {
    StrategyACandle
} from "../value-objects/StrategyAMarketData";

import {
    StrategyAConfiguration
} from "../value-objects/StrategyAConfiguration";

import {
    Spike
} from "../models/Spike";

import {
    TwoLeg,
    SwingLeg
} from "../models/TwoLeg";

export class TwoLegDetector {

    detect(
        candles: StrategyACandle[],
        spike: Spike,
        config: StrategyAConfiguration
    ): TwoLeg | null {
        const fromIndex = spike.endIndex + 1;

        // A valid setup needs: leg 1, an intervening retracement,
        // leg 2 completion, and at least one candle after completion
        // for LevelDetector to confirm the entry.
        if (fromIndex < 0 || fromIndex >= candles.length - 3) {
            return null;
        }

        if (spike.direction === "BUY") {
            return this.detectBullishCorrection(
                candles,
                spike,
                fromIndex,
                config
            );
        }

        return this.detectBearishCorrection(
            candles,
            spike,
            fromIndex,
            config
        );
    }

    private detectBullishCorrection(
        candles: StrategyACandle[],
        spike: Spike,
        fromIndex: number,
        config: StrategyAConfiguration
    ): TwoLeg | null {
        let leg1End: number | null = null;

        // Leg 1 begins immediately after the spike. The first candle
        // may itself be the local low/high that terminates leg 1.
        for (let i = fromIndex; i < candles.length - 2; i++) {
            const previous = candles[i - 1];
            const current = candles[i];
            const next = candles[i + 1];

            const previousLow = previous?.low ?? spike.endPrice;
            const localLow =
                current.low < previousLow &&
                (next.high > current.high || next.close > current.close);

            if (localLow) {
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
            startPrice: candles[fromIndex].high,
            endPrice: candles[leg1End].low
        };

        // A genuine two-leg correction requires a counter-move after leg 1.
        let retracementIndex: number | null = null;

        for (let i = leg1End + 1; i < candles.length - 2; i++) {
            if (
                candles[i].high > candles[leg1End].high ||
                candles[i].close > candles[leg1End].close
            ) {
                retracementIndex = i;
                break;
            }
        }

        if (retracementIndex === null) {
            return null;
        }

        let completionIndex: number | null = null;

        for (
            let i = retracementIndex + 1;
            i < candles.length - 1;
            i++
        ) {
            if (candles[i].low < candles[leg1End].low) {
                completionIndex = i;
                break;
            }
        }

        if (completionIndex === null) {
            return null;
        }

        const leg2: SwingLeg = {
            startIndex: retracementIndex,
            endIndex: completionIndex,
            startPrice: candles[retracementIndex].high,
            endPrice: candles[completionIndex].low
        };

        return this.buildTwoLeg(spike, leg1, leg2, config);
    }

    private detectBearishCorrection(
        candles: StrategyACandle[],
        spike: Spike,
        fromIndex: number,
        config: StrategyAConfiguration
    ): TwoLeg | null {
        let leg1End: number | null = null;

        // Leg 1 begins immediately after the spike. The first candle
        // may itself be the local high that terminates leg 1.
        for (let i = fromIndex; i < candles.length - 2; i++) {
            const previous = candles[i - 1];
            const current = candles[i];
            const next = candles[i + 1];

            const previousHigh = previous?.high ?? spike.endPrice;
            const localHigh =
                current.high > previousHigh &&
                (next.low < current.low || next.close < current.close);

            if (localHigh) {
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
            startPrice: candles[fromIndex].low,
            endPrice: candles[leg1End].high
        };

        // A genuine two-leg correction requires a counter-move after leg 1.
        let retracementIndex: number | null = null;

        for (let i = leg1End + 1; i < candles.length - 2; i++) {
            if (
                candles[i].low < candles[leg1End].low ||
                candles[i].close < candles[leg1End].close
            ) {
                retracementIndex = i;
                break;
            }
        }

        if (retracementIndex === null) {
            return null;
        }

        let completionIndex: number | null = null;

        for (
            let i = retracementIndex + 1;
            i < candles.length - 1;
            i++
        ) {
            if (candles[i].high > candles[leg1End].high) {
                completionIndex = i;
                break;
            }
        }

        if (completionIndex === null) {
            return null;
        }

        const leg2: SwingLeg = {
            startIndex: retracementIndex,
            endIndex: completionIndex,
            startPrice: candles[retracementIndex].low,
            endPrice: candles[completionIndex].high
        };

        return this.buildTwoLeg(spike, leg1, leg2, config);
    }

    private buildTwoLeg(
        spike: Spike,
        leg1: SwingLeg,
        leg2: SwingLeg,
        config: StrategyAConfiguration
    ): TwoLeg | null {
        const spikeRange = Math.abs(
            spike.endPrice - spike.startPrice
        );

        if (spikeRange <= 0) {
            return null;
        }

        const completionPrice = leg2.endPrice;

        const retraced =
            spike.direction === "BUY"
                ? spike.endPrice - completionPrice
                : completionPrice - spike.endPrice;

        if (retraced <= 0) {
            return null;
        }

        const retracementPercent =
            (retraced / spikeRange) * 100;

        if (
            retracementPercent < config.minRetracementPercent ||
            retracementPercent > config.maxRetracementPercent
        ) {
            return null;
        }

        return {
            leg1,
            leg2,
            retracementPercent,
            completionPrice,
            completionIndex: leg2.endIndex
        };
    }
}
