import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyADirection } from "../value-objects/StrategyASignalType";

export interface Displacement {
    direction: StrategyADirection;
    candleIndex: number;
    strength: number;          // 0-1, how strong the displacement is
    trueRange: number;
    bodySize: number;
    bodyRatio: number;         // body / trueRange
    trMultiple: number;       // TR / median TR
}

/**
 * Displacement Detector
 * 
 * Detects strong directional movement that creates market imbalance.
 * Displacement is different from a regular move because it shows:
 * 
 * 1. True Range significantly larger than recent volatility
 * 2. Large body (directional, not just volatile)
 * 3. High body-to-range ratio (efficient move, not just wicks)
 * 4. Breaking structural levels
 * 
 * This is important because there's a difference between:
 * - A small, noisy move
 * - A move that truly created market imbalance
 * 
 * For Strategy A:
 * Displacement confirms that the move after a structural event
 * (sweep, BOS) is real and has momentum.
 */
export class DisplacementDetector {
    
    constructor(
        private readonly lookbackForMedian: number = 20,
        private readonly minTrMultiple: number = 1.5,  // TR must be 1.5x median
        private readonly minBodyRatio: number = 0.6     // Body must be 60% of TR
    ) {}

    /**
     * Detect displacement in the candle data
     * 
     * @param candles - Array of candles (oldest first)
     * @param direction - Expected direction of displacement
     * @returns Displacement if found, null otherwise
     */
    detect(
        candles: StrategyACandle[],
        direction: StrategyADirection
    ): Displacement | null {
        if (candles.length < this.lookbackForMedian + 1) {
            return null;
        }

        // Calculate median True Range for baseline
        const medianTR = this.calculateMedianTR(candles, this.lookbackForMedian);
        if (medianTR <= 0) return null;

        // Check the most recent candle
        const lastCandleIndex = candles.length - 1;
        const lastCandle = candles[lastCandleIndex];

        // Check if this candle shows displacement
        const displacement = this.checkCandle(
            lastCandle, lastCandleIndex, medianTR, direction
        );

        if (displacement) {
            return displacement;
        }

        // Also check previous candle if recent one is weak
        if (lastCandleIndex > 0) {
            const prevCandle = candles[lastCandleIndex - 1];
            return this.checkCandle(
                prevCandle, lastCandleIndex - 1, medianTR, direction
            );
        }

        return null;
    }

    /**
     * Check if a single candle shows displacement
     */
    private checkCandle(
        candle: StrategyACandle,
        index: number,
        medianTR: number,
        direction: StrategyADirection
    ): Displacement | null {
        const trueRange = candle.high - candle.low;
        if (trueRange <= 0) return null;

        const bodySize = Math.abs(candle.close - candle.open);
        const bodyRatio = bodySize / trueRange;
        const trMultiple = trueRange / medianTR;

        // Check direction
        const isCorrectDirection = direction === "BUY"
            ? candle.close > candle.open
            : candle.close < candle.open;

        if (!isCorrectDirection) return null;

        // Check if TR is significantly larger than median
        if (trMultiple < this.minTrMultiple) return null;

        // Check if body ratio is high enough
        if (bodyRatio < this.minBodyRatio) return null;

        // Calculate strength (0-1)
        const strength = Math.min(1, 
            (trMultiple / this.minTrMultiple) * 0.5 +
            (bodyRatio / this.minBodyRatio) * 0.3 +
            0.2  // Base score for meeting criteria
        );

        return {
            direction,
            candleIndex: index,
            strength,
            trueRange,
            bodySize,
            bodyRatio,
            trMultiple
        };
    }

    /**
     * Calculate median True Range over lookback period
     */
    private calculateMedianTR(
        candles: StrategyACandle[],
        lookback: number
    ): number {
        const start = Math.max(0, candles.length - lookback - 1);
        const trs: number[] = [];

        for (let i = start; i < candles.length - 1; i++) {
            const tr = candles[i].high - candles[i].low;
            if (tr > 0) {
                trs.push(tr);
            }
        }

        if (trs.length === 0) return 0;

        trs.sort((a, b) => a - b);
        const mid = Math.floor(trs.length / 2);

        return trs.length % 2 === 0
            ? (trs[mid - 1] + trs[mid]) / 2
            : trs[mid];
    }
}
