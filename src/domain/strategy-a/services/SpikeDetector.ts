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
    StrategyADirection
} from "../value-objects/StrategyASignalType";

export class SpikeDetector {

    detect(
        candles: StrategyACandle[],
        config: StrategyAConfiguration
    ): Spike | null {
        if (candles.length < config.minSpikeCandles + 2) {
            return null;
        }

        const contextCandles =
            candles.slice(
                0,
                candles.length - 1
            );

        const avgRange =
            this.averageRange(
                contextCandles
            );

        if (avgRange <= 0) {
            return null;
        }

        for (
            let end = candles.length - 1;
            end >= config.minSpikeCandles - 1;
            end--
        ) {
            for (
                let count = config.minSpikeCandles;
                count <= config.maxSpikeCandles;
                count++
            ) {
                const start =
                    end - count + 1;

                if (start < 0) {
                    break;
                }

                const window =
                    candles.slice(start, end + 1);

                const bullish =
                    this.tryBuildSpike(
                        window,
                        start,
                        "BUY",
                        avgRange,
                        config
                    );

                if (bullish) {
                    return bullish;
                }

                const bearish =
                    this.tryBuildSpike(
                        window,
                        start,
                        "SELL",
                        avgRange,
                        config
                    );

                if (bearish) {
                    return bearish;
                }
            }
        }

        return null;
    }

    private tryBuildSpike(
        window: StrategyACandle[],
        startIndex: number,
        direction: StrategyADirection,
        avgRange: number,
        config: StrategyAConfiguration
    ): Spike | null {
        // Step 1: All candles must be strong in the spike direction
        const allStrong =
            window.every(
                candle =>
                    this.isStrongCandle(
                        candle,
                        direction,
                        config.minBodyRatio
                    )
            );

        if (!allStrong) {
            return null;
        }

        // Step 2: Check P-Gap between consecutive candles
        // P-Gap is MANDATORY — spike without gap is invalid
        const gapSize =
            this.calculateConsecutiveGapSize(
                window,
                direction
            );

        if (gapSize <= 0) {
            return null;
        }

        // Gap must be meaningful relative to average range
        if (
            gapSize <
            avgRange * config.minGapRatio
        ) {
            return null;
        }

        // Step 3: Check total move
        const startPrice =
            direction === "BUY"
                ? window[0].low
                : window[0].high;

        const endPrice =
            window[window.length - 1].close;

        const move =
            Math.abs(endPrice - startPrice);

        const movePercent =
            (move / startPrice) * 100;

        if (
            movePercent <
            config.minSpikeMovePercent
        ) {
            return null;
        }

        if (
            move <
            avgRange * config.minSpikeRangeMultiplier
        ) {
            return null;
        }

        // Step 4: Calculate extremes for SL
        const extremeHigh =
            Math.max(
                ...window.map(c => c.high)
            );

        const extremeLow =
            Math.min(
                ...window.map(c => c.low)
            );

        // Step 5: Calculate strength
        const strength =
            Math.min(
                1,
                (move / (avgRange * config.minSpikeRangeMultiplier)) *
                    0.5 +
                    (gapSize / (avgRange * config.minGapRatio)) *
                        0.3 +
                    window.length / config.maxSpikeCandles *
                        0.2
            );

        return {
            direction,
            startPrice,
            endPrice,
            startIndex,
            endIndex:
                startIndex + window.length - 1,
            strength,
            gapSize,
            candlesCount: window.length,
            extremeHigh,
            extremeLow
        };
    }

    private isStrongCandle(
        candle: StrategyACandle,
        direction: StrategyADirection,
        minBodyRatio: number
    ): boolean {
        const range =
            candle.high - candle.low;

        if (range <= 0) {
            return false;
        }

        const body =
            Math.abs(
                candle.close - candle.open
            );

        const bodyRatio =
            body / range;

        if (bodyRatio < minBodyRatio) {
            return false;
        }

        if (direction === "BUY") {
            return candle.close > candle.open;
        }

        return candle.close < candle.open;
    }

    /**
     * P-Gap: Gap between consecutive candles.
     * For BUY spike: current candle's low must be above previous candle's high
     * For SELL spike: current candle's high must be below previous candle's low
     * 
     * Returns the largest gap across all consecutive pairs in the window.
     */
    private calculateConsecutiveGapSize(
        window: StrategyACandle[],
        direction: StrategyADirection
    ): number {
        if (window.length < 2) {
            return 0;
        }

        let totalGap = 0;
        let hasGap = true;

        for (let i = 1; i < window.length; i++) {
            const prev = window[i - 1];
            const curr = window[i];

            const gap =
                direction === "BUY"
                    ? curr.low - prev.high
                    : prev.low - curr.high;

            if (gap <= 0) {
                hasGap = false;
                break;
            }

            totalGap += gap;
        }

        return hasGap ? totalGap : 0;
    }

    private averageRange(
        candles: StrategyACandle[]
    ): number {
        if (candles.length === 0) {
            return 0;
        }

        const sum =
            candles.reduce(
                (acc, c) =>
                    acc + (c.high - c.low),
                0
            );

        return sum / candles.length;
    }
}
