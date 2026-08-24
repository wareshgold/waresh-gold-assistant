import {
    describe,
    expect,
    it
} from "vitest";

import {
    SpikeDetector
} from "./SpikeDetector";

import {
    StrategyACandle
} from "../value-objects/StrategyAMarketData";

import {
    StrategyAConfiguration
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

const testConfig: StrategyAConfiguration = {
    symbol: "XAUUSD",
    timeframe: "M5",
    strategyVersion: "test",
    minSpikeCandles: 3,
    maxSpikeCandles: 3,
    minBodyRatio: 0.5,
    minSpikeRangeMultiplier: 0.5,
    minSpikeMovePercent: 0.01,
    minGapRatio: 0.01,
    minRetracementPercent: 20,
    maxRetracementPercent: 85,
    riskReward: 1
};


describe("SpikeDetector", () => {

    describe("happy path - BUY spike", () => {

        it("detects a valid BUY spike with P-Gaps", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(106, 108, 105.5, 108, 3),
                candle(107, 107.5, 106, 107.2, 4),
                candle(106.5, 107, 106, 106.5, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).not.toBeNull();
            expect(spike!.direction).toBe("BUY");
            expect(spike!.candlesCount).toBe(3);
            expect(spike!.gapSize).toBeGreaterThan(0);
        });

        it("detects BUY spike at the end of candle array", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(106, 108, 105.5, 108, 3),
                candle(107, 107.5, 106, 107.2, 4),
                candle(106.5, 107, 106, 106.5, 5),
                candle(106, 106.5, 105.5, 106, 6)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).not.toBeNull();
            expect(spike!.direction).toBe("BUY");
        });
    });

    describe("happy path - SELL spike", () => {

        it("detects a valid SELL spike with P-Gaps", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(108, 108.5, 106, 106, 1),
                candle(105, 105.5, 103, 103, 2),
                candle(102, 102.5, 100, 100, 3),
                candle(100.5, 101, 99.5, 100, 4),
                candle(100, 100.5, 99, 99.5, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).not.toBeNull();
            expect(spike!.direction).toBe("SELL");
            expect(spike!.candlesCount).toBe(3);
            expect(spike!.gapSize).toBeGreaterThan(0);
        });
    });

    describe("P-Gap validation", () => {

        it("rejects spike without gaps", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 103, 99, 102.5, 1),
                candle(102, 105, 101.5, 104.5, 2),
                candle(104, 107, 103.5, 106.5, 3),
                candle(106, 106.5, 105, 106.2, 4),
                candle(105.5, 106, 105, 105.8, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).toBeNull();
        });

        it("requires ALL consecutive pairs to have gaps", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(104, 107, 103.5, 106.5, 3),
                candle(106, 106.5, 105, 106.2, 4),
                candle(105.5, 106, 105, 105.8, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).toBeNull();
        });
    });

    describe("rejection", () => {

        it("returns null with too few candles", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(106, 108, 105.5, 108, 3),
                candle(107, 107.5, 106, 107.2, 4)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).toBeNull();
        });

        it("rejects weak candles", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 98, 100.1, 1),
                candle(103, 105, 101, 103.1, 2),
                candle(106, 108, 104, 106.1, 3),
                candle(107, 107.5, 106, 107.2, 4),
                candle(106.5, 107, 106, 106.5, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).toBeNull();
        });

        it("rejects mixed direction", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(106, 106.5, 104, 104.5, 3),
                candle(105, 107, 104.5, 107, 4),
                candle(106.5, 107, 106, 106.5, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).toBeNull();
        });

        it("rejects move too small", () => {
            const detector = new SpikeDetector();

            const config: StrategyAConfiguration = {
                ...testConfig,
                minSpikeMovePercent: 5.0
            };

            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 100.8, 1),
                candle(101.2, 101.8, 101, 101.6, 2),
                candle(102, 102.5, 101.8, 102.3, 3),
                candle(102, 102.5, 101.8, 102.2, 4),
                candle(102, 102.5, 101.8, 102.1, 5)
            ];

            const spike = detector.detect(candles, config);

            expect(spike).toBeNull();
        });
    });

    describe("edge cases", () => {

        it("returns null on empty candles", () => {
            const detector = new SpikeDetector();

            const spike = detector.detect([], testConfig);

            expect(spike).toBeNull();
        });

        it("handles zero range candles", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 100, 100, 100, 1),
                candle(100, 100, 100, 100, 2),
                candle(100, 100, 100, 100, 3),
                candle(100, 100, 100, 100, 4),
                candle(100, 100, 100, 100, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).toBeNull();
        });

        it("calculates correct extremeHigh and extremeLow", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(106, 108, 105.5, 108, 3),
                candle(107, 107.5, 106, 107.2, 4),
                candle(106.5, 107, 106, 106.5, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).not.toBeNull();
            expect(spike!.extremeHigh).toBe(108);
            expect(spike!.extremeLow).toBe(99.5);
        });

        it("calculates strength between 0 and 1", () => {
            const detector = new SpikeDetector();

            const candles: StrategyACandle[] = [
                candle(100, 102, 99.5, 102, 1),
                candle(103, 105, 102.5, 105, 2),
                candle(106, 108, 105.5, 108, 3),
                candle(107, 107.5, 106, 107.2, 4),
                candle(106.5, 107, 106, 106.5, 5)
            ];

            const spike = detector.detect(candles, testConfig);

            expect(spike).not.toBeNull();
            expect(spike!.strength).toBeGreaterThanOrEqual(0);
            expect(spike!.strength).toBeLessThanOrEqual(1);
        });
    });
});
