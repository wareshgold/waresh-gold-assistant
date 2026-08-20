import {
    describe,
    expect,
    it
} from "vitest";

import {
    SP2LSignalEngine
} from "../../../application/strategy/sp2l/SP2LSignalEngine";

import {
    SP2LCandle
} from "../value-objects/SP2LMarketData";

import {
    DEFAULT_SP2L_CONFIGURATION
} from "../value-objects/SP2LConfiguration";

function candle(
    open: number,
    high: number,
    low: number,
    close: number,
    timestamp: number
): SP2LCandle {
    return {
        open,
        high,
        low,
        close,
        volume: 1000,
        timestamp
    };
}

describe("SP2LSignalEngine", () => {

    it("should emit HOLD on simple upward momentum without full SP2L structure", () => {

        const engine =
            new SP2LSignalEngine(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                DEFAULT_SP2L_CONFIGURATION
            );

        const signal =
            engine.evaluate({
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(),
                candles: [
                    candle(100, 101, 99, 100, 1),
                    candle(100, 101, 99, 100, 2),
                    candle(100, 103, 100, 102, 3)
                ]
            });

        expect(signal.signalType).toBe("HOLD");
        expect(signal.reason.length).toBeGreaterThan(0);
    });


    it("should emit HOLD when momentum is weak", () => {

        const engine =
            new SP2LSignalEngine(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                DEFAULT_SP2L_CONFIGURATION
            );

        const signal =
            engine.evaluate({
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
            });

        expect(signal.signalType).toBe("HOLD");
    });


    it("should not throw on complete-looking bullish structure", () => {

        const engine =
            new SP2LSignalEngine(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    ...DEFAULT_SP2L_CONFIGURATION,
                    minSpikeMovePercent: 0.05,
                    minGapRatio: 0.02,
                    minSpikeRangeMultiplier: 1.0,
                    minRetracementPercent: 20,
                    maxRetracementPercent: 80
                }
            );

        const candles: SP2LCandle[] = [
            candle(100, 100.3, 99.9, 100.1, 1),
            candle(100.1, 100.4, 100, 100.2, 2),
            candle(100.3, 101.5, 100.2, 101.4, 3),
            candle(101.5, 102.8, 101.4, 102.7, 4),
            candle(102.8, 104.2, 102.7, 104.1, 5),
            candle(104.1, 104.2, 103.2, 103.3, 6),
            candle(103.3, 103.4, 102.4, 102.5, 7),
            candle(102.5, 103.2, 102.4, 103.1, 8),
            candle(103.1, 103.2, 102.2, 102.3, 9),
            candle(102.3, 102.4, 101.8, 101.9, 10),
            candle(101.9, 102.8, 101.8, 102.7, 11)
        ];

        const signal =
            engine.evaluate({
                symbol: "XAUUSD",
                timeframe: "M5",
                fetchedAt: new Date(),
                candles
            });

        expect([
            "BUY",
            "SELL",
            "HOLD"
        ]).toContain(signal.signalType);

        if (signal.signalType === "BUY") {
            expect(signal.entryPrice).toBeGreaterThan(0);
            expect(signal.stopLoss).toBeLessThan(signal.entryPrice);
            expect(signal.takeProfit).toBeGreaterThan(signal.entryPrice);
            expect(signal.spikeData).toBeDefined();
            expect(signal.twoLegData).toBeDefined();
        }
    });

});