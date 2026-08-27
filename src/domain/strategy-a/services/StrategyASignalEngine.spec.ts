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
    it("emits BUY immediately when the second leg completes", () => {
        const engine = new StrategyASignalEngine();

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

        expect(signal.signalType).toBe("BUY");
        expect(signal.entryPrice).toBe(101.2);
        expect(signal.stopLoss).toBe(signal.spikeData!.startPrice);
        expect(signal.takeProfit).toBeGreaterThan(signal.entryPrice);
        expect(signal.riskReward).toBe(1);
        expect(signal.spikeData).toBeDefined();
        expect(signal.twoLegData).toBeDefined();
        expect(signal.levelData).toBeDefined();
        expect(signal.levelData!.triggerCandleIndex).toBe(6);
        expect(signal.generatedAt.getTime()).toBe(7);
    });
});
