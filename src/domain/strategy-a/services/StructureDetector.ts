import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyADirection } from "../value-objects/StrategyASignalType";

export interface StructureBreak {
    type: "BOS" | "MSS";
    direction: StrategyADirection;
    breakLevel: number;          // The level that was broken
    breakCandleIndex: number;    // Index of candle that broke the structure
    previousSwingIndex: number;  // Index of the swing point that was broken
    breakStrength: number;       // How strong the break was (0-1)
}

/**
 * BOS/MSS Detector (Break of Structure / Market Structure Shift)
 * 
 * After a liquidity sweep, we need to verify that market structure
 * actually changed. This detector identifies:
 * 
 * BOS (Break of Structure):
 * - Price breaks a structural high/low in the new direction
 * - Confirms the trend change is real
 * 
 * MSS (Market Structure Shift):
 * - Change in the pattern of highs and lows
 * - Usually occurs after a liquidity event
 * 
 * For BUY setup:
 * 1. Price makes higher high (breaks previous swing high)
 * 2. Structure shifts from bearish to bullish
 * 
 * For SELL setup:
 * 1. Price makes lower low (breaks previous swing low)
 * 2. Structure shifts from bullish to bearish
 */
export class StructureDetector {
    
    /**
     * Detect structure break in the candle data
     * 
     * @param candles - Array of candles (oldest first)
     * @param lookback - Number of candles to look back for swing points
     * @returns StructureBreak if found, null otherwise
     */
    detect(
        candles: StrategyACandle[],
        lookback: number = 20
    ): StructureBreak | null {
        if (candles.length < lookback + 3) {
            return null;
        }

        // Find recent swing points
        const swingHighs = this.findSwingHighs(candles, lookback);
        const swingLows = this.findSwingLows(candles, lookback);

        // Check for bullish BOS (broke previous swing high)
        const bullishBOS = this.checkBullishBOS(candles, swingHighs);
        if (bullishBOS) {
            return bullishBOS;
        }

        // Check for bearish BOS (broke previous swing low)
        const bearishBOS = this.checkBearishBOS(candles, swingLows);
        if (bearishBOS) {
            return bearishBOS;
        }

        return null;
    }

    /**
     * Find swing highs (local maxima)
     */
    private findSwingHighs(
        candles: StrategyACandle[],
        lookback: number
    ): { index: number; price: number }[] {
        const swings: { index: number; price: number }[] = [];
        const start = Math.max(2, candles.length - lookback);

        for (let i = start; i < candles.length - 2; i++) {
            const prev = candles[i - 1];
            const curr = candles[i];
            const next = candles[i + 1];

            if (curr.high > prev.high && curr.high > next.high) {
                swings.push({ index: i, price: curr.high });
            }
        }

        return swings;
    }

    /**
     * Find swing lows (local minima)
     */
    private findSwingLows(
        candles: StrategyACandle[],
        lookback: number
    ): { index: number; price: number }[] {
        const swings: { index: number; price: number }[] = [];
        const start = Math.max(2, candles.length - lookback);

        for (let i = start; i < candles.length - 2; i++) {
            const prev = candles[i - 1];
            const curr = candles[i];
            const next = candles[i + 1];

            if (curr.low < prev.low && curr.low < next.low) {
                swings.push({ index: i, price: curr.low });
            }
        }

        return swings;
    }

    /**
     * Check for bullish BOS: price broke above previous swing high
     */
    private checkBullishBOS(
        candles: StrategyACandle[],
        swingHighs: { index: number; price: number }[]
    ): StructureBreak | null {
        const lastCandleIndex = candles.length - 1;
        const lastCandle = candles[lastCandleIndex];

        for (const swing of swingHighs) {
            // Check if recent candle broke above the swing high
            if (lastCandle.close > swing.price) {
                // Verify it's a valid break (close above, not just wick)
                const breakStrength = this.calculateBreakStrength(
                    lastCandle, swing.price, "BUY"
                );

                return {
                    type: "BOS",
                    direction: "BUY",
                    breakLevel: swing.price,
                    breakCandleIndex: lastCandleIndex,
                    previousSwingIndex: swing.index,
                    breakStrength
                };
            }
        }

        return null;
    }

    /**
     * Check for bearish BOS: price broke below previous swing low
     */
    private checkBearishBOS(
        candles: StrategyACandle[],
        swingLows: { index: number; price: number }[]
    ): StructureBreak | null {
        const lastCandleIndex = candles.length - 1;
        const lastCandle = candles[lastCandleIndex];

        for (const swing of swingLows) {
            // Check if recent candle broke below the swing low
            if (lastCandle.close < swing.price) {
                // Verify it's a valid break (close below, not just wick)
                const breakStrength = this.calculateBreakStrength(
                    lastCandle, swing.price, "SELL"
                );

                return {
                    type: "BOS",
                    direction: "SELL",
                    breakLevel: swing.price,
                    breakCandleIndex: lastCandleIndex,
                    previousSwingIndex: swing.index,
                    breakStrength
                };
            }
        }

        return null;
    }

    /**
     * Calculate how strong the break was
     * Returns value between 0 and 1
     */
    private calculateBreakStrength(
        candle: StrategyACandle,
        breakLevel: number,
        direction: StrategyADirection
    ): number {
        const range = candle.high - candle.low;
        if (range <= 0) return 0;

        let breakDistance: number;
        if (direction === "BUY") {
            breakDistance = candle.close - breakLevel;
        } else {
            breakDistance = breakLevel - candle.close;
        }

        // Normalize by candle range
        return Math.min(1, breakDistance / range);
    }
}
