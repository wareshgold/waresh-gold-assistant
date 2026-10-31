import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { FVG } from "./FVGDetector";

export interface FVGRetest {
    fvg: FVG;
    retestCandleIndex: number;
    retestPrice: number;         // Price at retest
    retestDepth: number;         // How deep into FVG price went (0-1)
    isPerfectRetest: boolean;    // Price touched FVG boundary exactly
}

/**
 * FVG Retest Detector
 * 
 * After an FVG is created, we wait for price to retrace to the FVG zone.
 * This is the potential re-entry point.
 * 
 * For Strategy A:
 * The sequence is: Spike → Sweep → BOS → Displacement → FVG → Retest → Entry
 * 
 * The FVG Retest is where we look for entry opportunities.
 * 
 * Key observations from research:
 * - FVG + Retest showed better performance in 1min timeframe
 * - But sample size was small
 * - This is a Research Hypothesis, not a final rule
 */
export class FVGRetestDetector {
    
    constructor(
        /**
         * Maximum number of candles to wait for retest
         */
        private readonly maxRetestDelay: number = 10,
        
        /**
         * Minimum depth into FVG to consider it a retest (0-1)
         */
        private readonly minRetestDepth: number = 0.3
    ) {}

    /**
     * Check if price has retested an FVG
     * 
     * @param candles - Array of candles (oldest first)
     * @param fvg - The FVG to check for retest
     * @returns FVGRetest if retest found, null otherwise
     */
    detect(
        candles: StrategyACandle[],
        fvg: FVG
    ): FVGRetest | null {
        if (candles.length < fvg.endIndex + 2) {
            return null;  // Not enough candles after FVG
        }

        // Check candles after FVG for retest
        const startIndex = fvg.endIndex + 1;
        const maxIndex = Math.min(
            startIndex + this.maxRetestDelay,
            candles.length
        );

        for (let i = startIndex; i < maxIndex; i++) {
            const candle = candles[i];
            const retest = this.checkCandleRetest(candle, i, fvg);
            
            if (retest) {
                return retest;
            }
        }

        return null;
    }

    /**
     * Check if a single candle retests the FVG
     */
    private checkCandleRetest(
        candle: StrategyACandle,
        index: number,
        fvg: FVG
    ): FVGRetest | null {
        const fvgRange = fvg.gapHigh - fvg.gapLow;
        if (fvgRange <= 0) return null;

        let retestDepth = 0;
        let retestPrice = 0;
        let isPerfectRetest = false;

        if (fvg.type === "BULLISH") {
            // For bullish FVG, price should come down to the FVG zone
            // Retest happens when candle low touches or enters the FVG
            if (candle.low <= fvg.gapHigh && candle.low >= fvg.gapLow) {
                // Price entered the FVG zone
                retestPrice = candle.low;
                retestDepth = (fvg.gapHigh - candle.low) / fvgRange;
                isPerfectRetest = Math.abs(candle.low - fvg.gapHigh) < fvgRange * 0.1;
            } else if (candle.low < fvg.gapLow) {
                // Price went through the FVG (deep retest)
                retestPrice = fvg.gapLow;
                retestDepth = 1.0;
                isPerfectRetest = false;
            }
        } else {
            // For bearish FVG, price should come up to the FVG zone
            // Retest happens when candle high touches or enters the FVG
            if (candle.high >= fvg.gapLow && candle.high <= fvg.gapHigh) {
                // Price entered the FVG zone
                retestPrice = candle.high;
                retestDepth = (candle.high - fvg.gapLow) / fvgRange;
                isPerfectRetest = Math.abs(candle.high - fvg.gapLow) < fvgRange * 0.1;
            } else if (candle.high > fvg.gapHigh) {
                // Price went through the FVG (deep retest)
                retestPrice = fvg.gapHigh;
                retestDepth = 1.0;
                isPerfectRetest = false;
            }
        }

        // Check if retest meets minimum depth requirement
        if (retestDepth < this.minRetestDepth) {
            return null;
        }

        return {
            fvg,
            retestCandleIndex: index,
            retestPrice,
            retestDepth,
            isPerfectRetest
        };
    }
}
