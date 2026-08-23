import { StrategyACandle } from "../value-objects/StrategyAMarketData";
import { StrategyAConfiguration } from "../value-objects/StrategyAConfiguration";
import { Spike } from "../models/Spike";
import { StrategyADirection } from "../value-objects/StrategyASignalType";

export class SpikeDetector {
    detect(candles: StrategyACandle[], config: StrategyAConfiguration): Spike | null {
        if (candles.length < config.minSpikeCandles + 2) return null;
        const avgRange = this.averageRange(candles.slice(0, -1));
        if (avgRange <= 0) return null;
        for (let end = candles.length - 1; end >= config.minSpikeCandles - 1; end--) {
            for (let count = config.minSpikeCandles; count <= config.maxSpikeCandles; count++) {
                const start = end - count + 1;
                if (start < 0) break;
                const window = candles.slice(start, end + 1);
                const bullish = this.tryBuildSpike(window, start, "BUY", avgRange, config);
                if (bullish) return bullish;
                const bearish = this.tryBuildSpike(window, start, "SELL", avgRange, config);
                if (bearish) return bearish;
            }
        }
        return null;
    }

    private tryBuildSpike(window: StrategyACandle[], startIndex: number, direction: StrategyADirection, avgRange: number, config: StrategyAConfiguration): Spike | null {
        if (!window.every(candle => this.isStrongCandle(candle, direction, config.minBodyRatio))) return null;
        const startPrice = direction === "BUY" ? window[0].low : window[0].high;
        const endPrice = window[window.length - 1].close;
        const move = Math.abs(endPrice - startPrice);
        const movePercent = (move / startPrice) * 100;
        if (movePercent < config.minSpikeMovePercent || move < avgRange * config.minSpikeRangeMultiplier) return null;
        const gapSize = this.calculateGapSize(window, direction);
        if (gapSize < avgRange * config.minGapRatio) return null;
        const extremeHigh = Math.max(...window.map(c => c.high));
        const extremeLow = Math.min(...window.map(c => c.low));
        const strength = Math.min(1, (move / (avgRange * config.minSpikeRangeMultiplier)) * 0.5 + (gapSize / (avgRange * config.minGapRatio)) * 0.3 + (window.length / config.maxSpikeCandles) * 0.2);
        return { direction, startPrice, endPrice, startIndex, endIndex: startIndex + window.length - 1, strength, gapSize, candlesCount: window.length, extremeHigh, extremeLow };
    }

    private isStrongCandle(candle: StrategyACandle, direction: StrategyADirection, minBodyRatio: number): boolean {
        const range = candle.high - candle.low;
        if (range <= 0) return false;
        const body = Math.abs(candle.close - candle.open);
        if (body / range < minBodyRatio) return false;
        return direction === "BUY" ? candle.close > candle.open : candle.close < candle.open;
    }

    private calculateGapSize(window: StrategyACandle[], direction: StrategyADirection): number {
        if (window.length < 3) return 0;
        let largestGap = 0;
        for (let i = 2; i < window.length; i++) {
            const first = window[i - 2];
            const third = window[i];
            const gap = direction === "BUY" ? Math.max(0, third.low - first.high) : Math.max(0, first.low - third.high);
            largestGap = Math.max(largestGap, gap);
        }
        return largestGap;
    }

    private averageRange(candles: StrategyACandle[]): number {
        if (candles.length === 0) return 0;
        return candles.reduce((acc, c) => acc + (c.high - c.low), 0) / candles.length;
    }
}
