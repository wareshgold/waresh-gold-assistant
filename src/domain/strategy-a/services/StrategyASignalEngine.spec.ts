import {
    describe,
    expect,
    it
} from "vitest";

import {
    StrategyASignalEngine
} from "./StrategyASignalEngine";

import {
    StrategyACandle
} from "../value-objects/StrategyAMarketData";

import {
    DEFAULT_StrategyA_CONFIGURATION
} from "../value-objects/StrategyAConfiguration";

function candle(
    open: number,
    high: number,
    low: number,
    close: number,
    timestamp: number
): StrategyACandle {
    return {
        open,
        high,
        low,
        close,
        volume: 1000,
        timestamp
    };
}

describe("StrategyASignalEngine", () => {
    it("emits HOLD when there is not enough market structure", () => {
        const engine = new StrategyASignalEngine();

        const signal = engine.evaluate(
            {
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(),
                candles: [
                    candle(100, 101, 99, 100, 1),
                    candle(100, 101, 99, 100, 2),
                    candle(100, 103, 100, 102, 3)
                ]
            },
            DEFAULT_StrategyA_CONFIGURATION
        );

        expect(signal.signalType).toBe("HOLD");
        expect(signal.reason.length).toBeGreaterThan(0);
    });

    it("emits HOLD when momentum is weak", () => {
        const engine = new StrategyASignalEngine();

        const signal = engine.evaluate(
            {
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(),
                candles: [
                    candle(100, 101, 99, 100, 1),
                    candle(100, 101, 99, 100, 2),
                    candle(100, 100.1, 99.9, 100.05, 3),
                    candle(100.05, 100.15, 100, 100.1, 4),
                    candle(100.1, 100.2, 100.05, 100.12, 5),
                    candle(100.12, 100.22, 100.08, 100.15, 6),
                    candle(100.15, 100.25, 100.1, 100.18, 7),
                    candle(100.18, 100.28, 100.12, 100.2, 8)
                ]
            },
            DEFAULT_StrategyA_CONFIGURATION
        );

        expect(signal.signalType).toBe("HOLD");
    });

    it("emits BUY immediately when the second leg completes", () => {
        const engine = new StrategyASignalEngine();

        const candles: StrategyACandle[] = [
            // Context before the spike
            candle(100, 101, 99.5, 100.8, 1),
            // 3-candle bullish spike
            candle(100, 101, 99.9, 100.8, 2),
            candle(101.2, 102.3, 101.1, 102.2, 3),
            candle(102.5, 104, 102.4, 103.8, 4),
            // Leg 1: correction down to a local low
            candle(103.7, 103.9, 101.8, 102, 5),
            // Intervening retracement upward
            candle(102, 104.2, 101.9, 104, 6),
            // Leg 2: completion is the entry trigger
            candle(104, 104.1, 101, 101.2, 7),
            // Newest closed/live candle is not needed for entry
            candle(101.2, 102.8, 101.1, 102.6, 8)
        ];

        const signal = engine.evaluate(
            {
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(),
                candles
            },
            {
                ...DEFAULT_StrategyA_CONFIGURATION,
                minSpikeRangeMultiplier: 1,
                minSpikeMovePercent: 0.05,
                minGapRatio: 0.02
            }
        );

        expect(signal.signalType).toBe("BUY");
        expect(signal.entryPrice).toBe(101.2);
        expect(signal.stopLoss).toBe(signal.spikeData!.startPrice);
        expect(signal.takeProfit).toBeGreaterThan(signal.entryPrice);
        expect(signal.riskReward).toBe(1);
        expect(signal.spikeData).toBeDefined();
        expect(signal.twoLegData).toBeDefined();
        expect(signal.levelData).toBeDefined();
        expect(signal.levelData!.triggerCandleIndex).toBe(6);
        expect(signal.generatedAt.getTime()).toBe(6);
    });
});
