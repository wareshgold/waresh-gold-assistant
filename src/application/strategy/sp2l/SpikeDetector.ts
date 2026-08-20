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
    SP2LDirection
} from "../../../domain/sp2l/value-objects/SP2LSignalType";

export class SpikeDetector {

    detect(
        candles: SP2LCandle[],
        config: SP2LConfiguration
    ): Spike | null {
        if (candles.length < config.minSpikeCandles + 2) {
            return null;
        }

        const avgRange =
            this.averageRange(
                candles.slice(0, -1)
            );

        if (avgRange <= 0) {
            return null;
        }

        // Scan recent windows ending at last closed-ish candle
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
        window: SP2LCandle[],
        startIndex: number,
        direction: SP2LDirection,
        avgRange: number,
        config: SP2LConfiguration
    ): Spike | null {
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

        const startPrice =
            direction === "BUY"
                ? window[0].low
                : window[0].high;

        const endPrice =
            direction === "BUY"
                ? window[window.length - 1].close
                : window[window.length - 1].close;

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

        const gapSize =
            this.calculateGapSize(
                window,
                direction
            );

        if (
            gapSize <
            avgRange * config.minGapRatio
        ) {
            return null;
        }

        const extremeHigh =
            Math.max(
                ...window.map(c => c.high)
            );

        const extremeLow =
            Math.min(
                ...window.map(c => c.low)
            );

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
            candlesCount:
                window.length,
            extremeHigh,
            extremeLow
        };
    }

    private isStrongCandle(
        candle: SP2LCandle,
        direction: SP2LDirection,
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
     * P-Gap: cumulative directional displacement gaps
     * between consecutive candles in spike direction.
     */
    private calculateGapSize(
        window: SP2LCandle[],
        direction: SP2LDirection
    ): number {
        let gap = 0;

        for (
            let i = 1;
            i < window.length;
            i++
        ) {
            const prev =
                window[i - 1];

            const curr =
                window[i];

            if (direction === "BUY") {
                // Bullish displacement: current open/low jumps above prev close/body
                const displacement =
                    Math.max(
                        0,
                        curr.low - prev.close
                    );

                const bodyJump =
                    Math.max(
                        0,
                        curr.open - prev.close
                    );

                gap +=
                    Math.max(
                        displacement,
                        bodyJump
                    );
            } else {
                const displacement =
                    Math.max(
                        0,
                        prev.close - curr.high
                    );

                const bodyJump =
                    Math.max(
                        0,
                        prev.close - curr.open
                    );

                gap +=
                    Math.max(
                        displacement,
                        bodyJump
                    );
            }
        }

        // Also count large body continuity as gap-like pressure when pure gaps are small
        if (gap === 0) {
            for (
                let i = 1;
                i < window.length;
                i++
            ) {
                const prev =
                    window[i - 1];

                const curr =
                    window[i];

                if (direction === "BUY") {
                    gap +=
                        Math.max(
                            0,
                            curr.close - prev.high
                        ) * 0.5;
                } else {
                    gap +=
                        Math.max(
                            0,
                            prev.low - curr.close
                        ) * 0.5;
                }
            }
        }

        return gap;
    }

    private averageRange(
        candles: SP2LCandle[]
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