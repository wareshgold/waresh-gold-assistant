import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyADirection } from "../value-objects/StrategyASignalType";

export interface FVG {
    direction: StrategyADirection;
    type: "BULLISH" | "BEARISH";
    startIndex: number;       // Index of first candle
    endIndex: number;         // Index of third candle
    gapHigh: number;          // Upper boundary of FVG
    gapLow: number;           // Lower boundary of FVG
    gapSize: number;          // Size of the gap
    gapRatio: number;         // gapSize / average range
}

/**
 * FVG (Fair Value Gap) Detector
 * 
 * FVG is a 3-candle imbalance where there's a gap between:
 * - Bullish FVG: candle 1 high < candle 3 low
 * - Bearish FVG: candle 1 low > candle 3 high
 * 
 * This indicates market imbalance and potential re-entry zone.
 * 
 * For Strategy A:
 * FVG is NOT an entry signal by itself.
 * It's part of the structural sequence:
 * 
 * Spike → Sweep → BOS → Displacement → FVG → Retest → Entry
 * 
 * The FVG zone is where we expect price to retrace to
 * before continuing in the direction of the move.
 */
export class FVGDetector {
    
    constructor(
        private readonly minGapRatio: number = 0.1  // Gap must be 10% of avg range
    ) {}

    /**
     * Detect FVG in the candle data
     * 
     * @param candles - Array of candles (oldest first)
     * @returns FVG if found, null otherwise
     */
    detect(candles: StrategyACandle[]): FVG | null {
        if (candles.length < 3) {
            return null;
        }

        // Calculate average range for gap ratio
        const avgRange = this.calculateAverageRange(candles);
        if (avgRange <= 0) return null;

        // Check the last 3 candles for FVG
        const last3Candles = candles.slice(-3);
        const startIndex = candles.length - 3;

        // Check for bullish FVG
        const bullishFVG = this.checkBullishFVG(
            last3Candles, startIndex, avgRange
        );
        if (bullishFVG) {
            return bullishFVG;
        }

        // Check for bearish FVG
        const bearishFVG = this.checkBearishFVG(
            last3Candles, startIndex, avgRange
        );
        if (bearishFVG) {
            return bearishFVG;
        }

        return null;
    }

    /**
     * Detect all FVGs in the candle data
     * 
     * @param candles - Array of candles (oldest first)
     * @returns Array of FVGs found
     */
    detectAll(candles: StrategyACandle[]): FVG[] {
        const fvgs: FVG[] = [];

        if (candles.length < 3) {
            return fvgs;
        }

        const avgRange = this.calculateAverageRange(candles);
        if (avgRange <= 0) return fvgs;

        // Check all possible 3-candle combinations
        for (let i = 0; i <= candles.length - 3; i++) {
            const threeCandles = candles.slice(i, i + 3);

            const bullishFVG = this.checkBullishFVG(threeCandles, i, avgRange);
            if (bullishFVG) {
                fvgs.push(bullishFVG);
            }

            const bearishFVG = this.checkBearishFVG(threeCandles, i, avgRange);
            if (bearishFVG) {
                fvgs.push(bearishFVG);
            }
        }

        return fvgs;
    }

    /**
     * Check for bullish FVG: candle 1 high < candle 3 low
     */
    private checkBullishFVG(
        candles: StrategyACandle[],
        startIndex: number,
        avgRange: number
    ): FVG | null {
        const [candle1, candle2, candle3] = candles;

        // Bullish FVG: gap between candle1.high and candle3.low
        const gapLow = candle1.high;
        const gapHigh = candle3.low;

        if (gapHigh <= gapLow) {
            return null;  // No gap
        }

        const gapSize = gapHigh - gapLow;
        const gapRatio = gapSize / avgRange;

        if (gapRatio < this.minGapRatio) {
            return null;  // Gap too small
        }

        return {
            direction: "BUY",
            type: "BULLISH",
            startIndex,
            endIndex: startIndex + 2,
            gapHigh,
            gapLow,
            gapSize,
            gapRatio
        };
    }

    /**
     * Check for bearish FVG: candle 1 low > candle 3 high
     */
    private checkBearishFVG(
        candles: StrategyACandle[],
        startIndex: number,
        avgRange: number
    ): FVG | null {
        const [candle1, candle2, candle3] = candles;

        // Bearish FVG: gap between candle3.high and candle1.low
        const gapHigh = candle1.low;
        const gapLow = candle3.high;

        if (gapLow >= gapHigh) {
            return null;  // No gap
        }

        const gapSize = gapHigh - gapLow;
        const gapRatio = gapSize / avgRange;

        if (gapRatio < this.minGapRatio) {
            return null;  // Gap too small
        }

        return {
            direction: "SELL",
            type: "BEARISH",
            startIndex,
            endIndex: startIndex + 2,
            gapHigh,
            gapLow,
            gapSize,
            gapRatio
        };
    }

    /**
     * Calculate average range over all candles
     */
    private calculateAverageRange(candles: StrategyACandle[]): number {
        if (candles.length === 0) return 0;

        const totalRange = candles.reduce(
            (sum, c) => sum + (c.high - c.low), 0
        );

        return totalRange / candles.length;
    }
}
