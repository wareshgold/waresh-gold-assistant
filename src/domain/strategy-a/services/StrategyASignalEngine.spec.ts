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
        timestamp
    };
}

describe("StrategyASignalEngine", () => {
    it("returns HOLD when outside Opportunity Window", () => {
        const engine = new StrategyASignalEngine();

        // Create candles that would normally trigger a signal
        const candles = [
            candle(99, 100, 98.8, 99.8, 0),
            candle(99.8, 100.4, 99.7, 100.2, 1),
            candle(100.2, 101, 100.1, 100.8, 2),
            candle(101.2, 102.3, 101.1, 102.2, 3),
            candle(102.5, 104, 102.4, 103.8, 4),
            candle(103.7, 103.9, 101.8, 102, 5),
            candle(102, 104.2, 101.9, 104, 6),
            candle(104, 104.1, 101, 101.2, 7),
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

        // New engine requires Market Regime, Sweep, BOS, Displacement, FVG, Retest
        // So simple spike + twoLeg is not enough anymore
        expect(signal.signalType).toBe("HOLD");
        expect(signal.reason).toContain("Opportunity Window");
    });

    it("returns HOLD when no candles provided", () => {
        const engine = new StrategyASignalEngine();

        const signal = engine.evaluate(
            {
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(),
                candles: []
            },
            DEFAULT_StrategyA_CONFIGURATION
        );

        expect(signal.signalType).toBe("HOLD");
        expect(signal.reason).toContain("داده کندل وجود ندارد");
    });

    it("returns HOLD when spike not detected", () => {
        const engine = new StrategyASignalEngine();

        // Create flat candles with no spike
        // Use PRE_NY_BUILD window: 16:30-17:30 Tehran = 13:00-14:00 UTC
        // Last candle must be within the window, so start early enough
        const baseTime = Date.UTC(2026, 7, 31, 13, 5, 0);  // 13:05 UTC = 16:35 Tehran
        const candles = Array.from({ length: 10 }, (_, i) =>
            candle(100, 100.5, 99.5, 100.2, baseTime + i * 300000)  // M5 intervals
        );

        const signal = engine.evaluate(
            {
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(baseTime),
                candles
            },
            DEFAULT_StrategyA_CONFIGURATION
        );

        expect(signal.signalType).toBe("HOLD");
        expect(signal.reason).toContain("Spike");
    });
});
