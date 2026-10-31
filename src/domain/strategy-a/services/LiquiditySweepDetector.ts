import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyADirection } from "../value-objects/StrategyASignalType";

export interface LiquiditySweep {
    direction: StrategyADirection;  // BUY = swept low, SELL = swept high
    sweepLevel: number;             // The level that was swept
    sweepCandleIndex: number;       // Index of candle that did the sweep
    recoveryCandleIndex: number;    // Index of candle that showed recovery
    sweepDepth: number;             // How far price went beyond the level
    recoveryStrength: number;       // How strong the recovery was (0-1)
}

/**
 * Liquidity Sweep Detector
 * 
 * Detects when price sweeps a previous high/low and then reverses.
 * This is a key component of the Strategy A structural sequence:
 * 
 * Spike → Sweep → BOS → Displacement → FVG → Retest → Entry
 * 
 * For BUY setup:
 * 1. Price drops below a previous low (sweep)
 * 2. Price recovers back above the low
 * 3. Short-term structure shifts bullish
 * 
 * For SELL setup:
 * 1. Price rises above a previous high (sweep)
 * 2. Price recovers back below the high
 * 3. Short-term structure shifts bearish
 */
export class LiquiditySweepDetector {
    
    /**
     * Detect liquidity sweep in the candle data
     * 
     * @param candles - Array of candles (oldest first)
     * @param lookback - Number of candles to look back for swing points
     * @returns LiquiditySweep if found, null otherwise
     */
    detect(
        candles: StrategyACandle[],
        lookback: number = 20
    ): LiquiditySweep | null {
        if (candles.length < lookback + 3) {
            return null;
        }

        // Find recent swing lows and highs
        const swingLows = this.findSwingLows(candles, lookback);
        const swingHighs = this.findSwingHighs(candles, lookback);

        // Check for bullish sweep (swept low, then recovered)
        const bullishSweep = this.checkBullishSweep(candles, swingLows);
        if (bullishSweep) {
            return bullishSweep;
        }

        // Check for bearish sweep (swept high, then recovered)
        const bearishSweep = this.checkBearishSweep(candles, swingHighs);
        if (bearishSweep) {
            return bearishSweep;
        }

        return null;
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

            // Swing low: current low is lower than both neighbors
            if (curr.low < prev.low && curr.low < next.low) {
                swings.push({ index: i, price: curr.low });
            }
        }

        return swings;
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

            // Swing high: current high is higher than both neighbors
            if (curr.high > prev.high && curr.high > next.high) {
                swings.push({ index: i, price: curr.high });
            }
        }

        return swings;
    }

    /**
     * Check for bullish sweep: price swept a low, then recovered
     */
    private checkBullishSweep(
        candles: StrategyACandle[],
        swingLows: { index: number; price: number }[]
    ): LiquiditySweep | null {
        const lastCandleIndex = candles.length - 1;
        const lastCandle = candles[lastCandleIndex];

        for (const swing of swingLows) {
            // Check if recent candles swept below the swing low
            for (let i = swing.index + 1; i < candles.length - 1; i++) {
                const candle = candles[i];
                
                // Sweep: candle low went below swing low
                if (candle.low < swing.price) {
                    // Recovery: next candle closed above swing low
                    const nextCandle = candles[i + 1];
                    if (nextCandle && nextCandle.close > swing.price) {
                        const sweepDepth = swing.price - candle.low;
                        const recoveryStrength = this.calculateRecoveryStrength(
                            candle, nextCandle, swing.price
                        );

                        return {
                            direction: "BUY",
                            sweepLevel: swing.price,
                            sweepCandleIndex: i,
                            recoveryCandleIndex: i + 1,
                            sweepDepth,
                            recoveryStrength
                        };
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check for bearish sweep: price swept a high, then recovered
     */
    private checkBearishSweep(
        candles: StrategyACandle[],
        swingHighs: { index: number; price: number }[]
    ): LiquiditySweep | null {
        for (const swing of swingHighs) {
            // Check if recent candles swept above the swing high
            for (let i = swing.index + 1; i < candles.length - 1; i++) {
                const candle = candles[i];
                
                // Sweep: candle high went above swing high
                if (candle.high > swing.price) {
                    // Recovery: next candle closed below swing high
                    const nextCandle = candles[i + 1];
                    if (nextCandle && nextCandle.close < swing.price) {
                        const sweepDepth = candle.high - swing.price;
                        const recoveryStrength = this.calculateRecoveryStrength(
                            candle, nextCandle, swing.price
                        );

                        return {
                            direction: "SELL",
                            sweepLevel: swing.price,
                            sweepCandleIndex: i,
                            recoveryCandleIndex: i + 1,
                            sweepDepth,
                            recoveryStrength
                        };
                    }
                }
            }
        }

        return null;
    }

    /**
     * Calculate how strong the recovery was
     * Returns value between 0 and 1
     */
    private calculateRecoveryStrength(
        sweepCandle: StrategyACandle,
        recoveryCandle: StrategyACandle,
        sweepLevel: number
    ): number {
        const range = sweepCandle.high - sweepCandle.low;
        if (range <= 0) return 0;

        // Recovery is measured by how much of the sweep was recovered
        const recovery = Math.abs(recoveryCandle.close - sweepLevel);
        return Math.min(1, recovery / range);
    }
}
