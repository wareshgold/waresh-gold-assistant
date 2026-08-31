import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyADirection } from "../value-objects/StrategyASignalType";

export interface EntryGeometry {
    // Impulse metrics
    impulseScore: number;        // Impulse strength relative to volatility
    impulseRange: number;        // Size of impulse move
    impulseBodyFraction: number; // Body / True Range of impulse
    
    // Retracement metrics
    retracementPercent: number;  // How much price retraced (0-100%)
    
    // Entry location metrics
    entryLocation: number;       // Where entry is relative to impulse (0-1)
    distanceFromExtreme: number; // Distance from impulse extreme
    
    // Delay metrics
    delayCandles: number;        // Candles between impulse and entry
    
    // Compression metrics
    compressionRatio: number;    // Recent volatility / previous volatility
    
    // Risk geometry
    stopToImpulseRatio: number;  // Stop distance / impulse range
    
    // Overall score
    score: number;               // Combined score (0-1)
}

/**
 * Entry Geometry Analyzer
 * 
 * Analyzes the quality of entry location relative to the impulse move.
 * Instead of just saying "setup exists", we evaluate WHERE the entry
 * is within the move.
 * 
 * Key features from research:
 * - Impulse Score: strength of the largest move before entry
 * - Retracement: how much price pulled back
 * - Entry Location: where entry is within the impulse
 * - Delay: candles between impulse and entry
 * - Compression: volatility compression before expansion
 * 
 * Research findings:
 * - Some buckets showed positive OOS results in 1min
 * - But sample sizes were small
 * - This is a Research Hypothesis, not a final rule
 */
export class EntryGeometryAnalyzer {
    
    constructor(
        private readonly lookbackForMedian: number = 20
    ) {}

    /**
     * Analyze entry geometry for a potential trade
     * 
     * @param candles - Array of candles (oldest first)
     * @param direction - Trade direction (BUY/SELL)
     * @param entryIndex - Index of the entry candle
     * @param stopLoss - Stop loss price
     * @returns EntryGeometry analysis
     */
    analyze(
        candles: StrategyACandle[],
        direction: StrategyADirection,
        entryIndex: number,
        stopLoss: number
    ): EntryGeometry | null {
        if (entryIndex < 3 || entryIndex >= candles.length) {
            return null;
        }

        // Find the impulse move before entry
        const impulse = this.findImpulse(candles, entryIndex, direction);
        if (!impulse) {
            return null;
        }

        // Calculate all metrics
        const impulseScore = this.calculateImpulseScore(
            impulse.range, candles, entryIndex
        );
        
        const retracementPercent = this.calculateRetracement(
            impulse, candles[entryIndex], direction
        );
        
        const entryLocation = this.calculateEntryLocation(
            impulse, candles[entryIndex], direction
        );
        
        const distanceFromExtreme = this.calculateDistanceFromExtreme(
            impulse, candles[entryIndex], direction
        );
        
        const delayCandles = entryIndex - impulse.endIndex;
        
        const compressionRatio = this.calculateCompressionRatio(
            candles, entryIndex
        );
        
        const stopToImpulseRatio = this.calculateStopToImpulse(
            stopLoss, candles[entryIndex].close, impulse.range, direction
        );
        
        const impulseBodyFraction = this.calculateImpulseBodyFraction(
            candles, impulse, direction
        );

        // Calculate combined score
        const score = this.calculateOverallScore({
            impulseScore,
            retracementPercent,
            entryLocation,
            compressionRatio,
            stopToImpulseRatio
        });

        return {
            impulseScore,
            impulseRange: impulse.range,
            impulseBodyFraction,
            retracementPercent,
            entryLocation,
            distanceFromExtreme,
            delayCandles,
            compressionRatio,
            stopToImpulseRatio,
            score
        };
    }

    /**
     * Find the impulse move before entry
     */
    private findImpulse(
        candles: StrategyACandle[],
        entryIndex: number,
        direction: StrategyADirection
    ): { startIndex: number; endIndex: number; range: number; startPrice: number; endPrice: number } | null {
        // Look back from entry to find the largest directional move
        let bestImpulse = null;
        let bestRange = 0;

        const maxLookback = Math.min(entryIndex, 15);

        for (let start = entryIndex - maxLookback; start < entryIndex; start++) {
            for (let end = start + 1; end <= entryIndex; end++) {
                const startCandle = candles[start];
                const endCandle = candles[end];

                let range: number;
                let startPrice: number;
                let endPrice: number;

                if (direction === "BUY") {
                    startPrice = startCandle.low;
                    endPrice = endCandle.high;
                    range = endPrice - startPrice;
                } else {
                    startPrice = startCandle.high;
                    endPrice = endCandle.low;
                    range = startPrice - endPrice;
                }

                if (range > bestRange) {
                    bestRange = range;
                    bestImpulse = {
                        startIndex: start,
                        endIndex: end,
                        range,
                        startPrice,
                        endPrice
                    };
                }
            }
        }

        return bestImpulse;
    }

    /**
     * Calculate impulse score (impulse range / median TR)
     */
    private calculateImpulseScore(
        impulseRange: number,
        candles: StrategyACandle[],
        entryIndex: number
    ): number {
        const medianTR = this.calculateMedianTR(candles, entryIndex);
        if (medianTR <= 0) return 0;
        return impulseRange / medianTR;
    }

    /**
     * Calculate retracement percentage
     */
    private calculateRetracement(
        impulse: { range: number; endPrice: number },
        entryCandle: StrategyACandle,
        direction: StrategyADirection
    ): number {
        if (impulse.range <= 0) return 0;

        let retracement: number;
        if (direction === "BUY") {
            retracement = impulse.endPrice - entryCandle.close;
        } else {
            retracement = entryCandle.close - impulse.endPrice;
        }

        return Math.max(0, (retracement / impulse.range) * 100);
    }

    /**
     * Calculate entry location (0-1, where 0 is at impulse start, 1 is at impulse end)
     */
    private calculateEntryLocation(
        impulse: { startPrice: number; endPrice: number },
        entryCandle: StrategyACandle,
        direction: StrategyADirection
    ): number {
        const impulseRange = impulse.endPrice - impulse.startPrice;
        if (impulseRange <= 0) return 0.5;

        let entryPosition: number;
        if (direction === "BUY") {
            entryPosition = entryCandle.close - impulse.startPrice;
        } else {
            entryPosition = impulse.startPrice - entryCandle.close;
        }

        return Math.max(0, Math.min(1, entryPosition / impulseRange));
    }

    /**
     * Calculate distance from extreme
     */
    private calculateDistanceFromExtreme(
        impulse: { endPrice: number; range: number },
        entryCandle: StrategyACandle,
        direction: StrategyADirection
    ): number {
        if (impulse.range <= 0) return 0;

        let distance: number;
        if (direction === "BUY") {
            distance = impulse.endPrice - entryCandle.close;
        } else {
            distance = entryCandle.close - impulse.endPrice;
        }

        return Math.max(0, distance / impulse.range);
    }

    /**
     * Calculate compression ratio (recent volatility / previous volatility)
     */
    private calculateCompressionRatio(
        candles: StrategyACandle[],
        entryIndex: number
    ): number {
        if (entryIndex < 10) return 1;

        // Recent 5 candles volatility
        const recentTRs: number[] = [];
        for (let i = entryIndex - 4; i <= entryIndex; i++) {
            if (i >= 0 && i < candles.length) {
                recentTRs.push(candles[i].high - candles[i].low);
            }
        }

        // Previous 10 candles volatility
        const prevTRs: number[] = [];
        for (let i = entryIndex - 14; i < entryIndex - 4; i++) {
            if (i >= 0 && i < candles.length) {
                prevTRs.push(candles[i].high - candles[i].low);
            }
        }

        if (recentTRs.length === 0 || prevTRs.length === 0) return 1;

        const recentMedian = this.median(recentTRs);
        const prevMedian = this.median(prevTRs);

        if (prevMedian <= 0) return 1;

        return recentMedian / prevMedian;
    }

    /**
     * Calculate stop to impulse ratio
     */
    private calculateStopToImpulse(
        stopLoss: number,
        entryPrice: number,
        impulseRange: number,
        direction: StrategyADirection
    ): number {
        if (impulseRange <= 0) return 1;

        const stopDistance = Math.abs(entryPrice - stopLoss);
        return (stopDistance / impulseRange) * 100;
    }

    /**
     * Calculate impulse body fraction
     */
    private calculateImpulseBodyFraction(
        candles: StrategyACandle[],
        impulse: { startIndex: number; endIndex: number; range: number },
        direction: StrategyADirection
    ): number {
        if (impulse.range <= 0) return 0;

        // Calculate total body size in impulse
        let totalBody = 0;
        for (let i = impulse.startIndex; i <= impulse.endIndex; i++) {
            const candle = candles[i];
            const body = Math.abs(candle.close - candle.open);
            
            // Only count bodies in the correct direction
            const isCorrectDirection = direction === "BUY"
                ? candle.close > candle.open
                : candle.close < candle.open;
            
            if (isCorrectDirection) {
                totalBody += body;
            }
        }

        return totalBody / impulse.range;
    }

    /**
     * Calculate overall score
     */
    private calculateOverallScore(metrics: {
        impulseScore: number;
        retracementPercent: number;
        entryLocation: number;
        compressionRatio: number;
        stopToImpulseRatio: number;
    }): number {
        let score = 0;

        // Impulse score (higher is better, but cap at 3)
        score += Math.min(1, metrics.impulseScore / 3) * 0.25;

        // Retracement (25-50% is ideal)
        const retracementScore = metrics.retracementPercent >= 25 && metrics.retracementPercent <= 50
            ? 1
            : metrics.retracementPercent < 25
                ? metrics.retracementPercent / 25
                : Math.max(0, 1 - (metrics.retracementPercent - 50) / 50);
        score += retracementScore * 0.25;

        // Entry location (25-75% is ideal)
        const locationScore = metrics.entryLocation >= 0.25 && metrics.entryLocation <= 0.75
            ? 1
            : metrics.entryLocation < 0.25
                ? metrics.entryLocation / 0.25
                : Math.max(0, 1 - (metrics.entryLocation - 0.75) / 0.25);
        score += locationScore * 0.2;

        // Compression (lower is better, <0.75 is good)
        const compressionScore = metrics.compressionRatio < 0.75
            ? 1
            : Math.max(0, 1 - (metrics.compressionRatio - 0.75) / 0.5);
        score += compressionScore * 0.15;

        // Stop to impulse (25-50% is ideal)
        const stopScore = metrics.stopToImpulseRatio >= 25 && metrics.stopToImpulseRatio <= 50
            ? 1
            : metrics.stopToImpulseRatio < 25
                ? metrics.stopToImpulseRatio / 25
                : Math.max(0, 1 - (metrics.stopToImpulseRatio - 50) / 50);
        score += stopScore * 0.15;

        return Math.min(1, score);
    }

    /**
     * Calculate median TR over lookback period
     */
    private calculateMedianTR(
        candles: StrategyACandle[],
        endIndex: number
    ): number {
        const start = Math.max(0, endIndex - this.lookbackForMedian);
        const trs: number[] = [];

        for (let i = start; i < endIndex; i++) {
            if (i < candles.length) {
                trs.push(candles[i].high - candles[i].low);
            }
        }

        return this.median(trs);
    }

    /**
     * Calculate median of array
     */
    private median(arr: number[]): number {
        if (arr.length === 0) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }
}
