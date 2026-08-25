import {
    describe,
    expect,
    it
} from "vitest";

import {
    TwoLegDetector
} from "./TwoLegDetector";

import {
    StrategyACandle
} from "../value-objects/StrategyAMarketData";

import {
    StrategyAConfiguration
} from "../value-objects/StrategyAConfiguration";

import {
    Spike
} from "../models/Spike";


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

function makeSpike(
    direction: "BUY" | "SELL",
    startIndex: number,
    endIndex: number,
    startPrice: number,
    endPrice: number
): Spike {
    return {
        direction,
        startPrice,
        endPrice,
        startIndex,
        endIndex,
        strength: 0.8,
        gapSize: 2.0,
        candlesCount: 3,
        extremeHigh: Math.max(startPrice, endPrice) + 1,
        extremeLow: Math.min(startPrice, endPrice) - 1
    };
}


describe("TwoLegDetector", () => {

    describe("happy path - BUY correction", () => {

        it("detects bullish correction when candle breaks previous low", () => {
            const detector = new TwoLegDetector();

            // Spike: 99.5 → 106 (range 6.5)
            // Correction: drops to 102.5 (~54% retracement)
            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(103, 103.5, 102.5, 102.8, 4),
                candle(102.5, 103, 102, 102.2, 5),
                candle(102.2, 102.5, 101.5, 101.8, 6),
                candle(101.8, 102, 101, 101.2, 7)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).not.toBeNull();
            expect(twoLeg!.completionPrice).toBeLessThan(106);
            expect(twoLeg!.retracementPercent).toBeGreaterThan(20);
            expect(twoLeg!.retracementPercent).toBeLessThan(85);
        });

        it("completes at lowest point after break", () => {
            const detector = new TwoLegDetector();

            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(103, 103.5, 102.5, 102.8, 4),
                candle(102.5, 103, 102, 102.2, 5),
                candle(102.2, 102.5, 101.5, 101.8, 6),
                candle(101.8, 102, 101, 101.2, 7)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).not.toBeNull();
            expect(twoLeg!.completionPrice).toBe(101);
        });
    });

    describe("happy path - SELL correction", () => {

        it("detects bearish correction when candle breaks previous high", () => {
            const detector = new TwoLegDetector();

            // Spike: 106 → 100 (range 6)
            // Correction: rises to 103.5 (~58% retracement)
            const candles: StrategyACandle[] = [
                candle(106, 106, 104, 104, 1),
                candle(103, 104, 102, 102, 2),
                candle(101, 101.5, 100, 100, 3),
                candle(101, 103, 100.5, 102.8, 4),
                candle(102.8, 104, 102, 103.5, 5),
                candle(103.5, 104.5, 103, 104.2, 6),
                candle(104.2, 105, 104, 104.8, 7)
            ];

            const spike = makeSpike("SELL", 0, 2, 106, 100);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).not.toBeNull();
            expect(twoLeg!.completionPrice).toBeGreaterThan(100);
            expect(twoLeg!.retracementPercent).toBeGreaterThan(20);
            expect(twoLeg!.retracementPercent).toBeLessThan(85);
        });
    });

    describe("rejection", () => {

        it("returns null when no break after BUY spike", () => {
            const detector = new TwoLegDetector();

            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(106, 107, 105.5, 106.5, 4),
                candle(106.5, 107.5, 106, 107, 5),
                candle(107, 108, 106.5, 107.5, 6)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).toBeNull();
        });

        it("returns null when retracement too shallow", () => {
            const detector = new TwoLegDetector();

            const config: StrategyAConfiguration = {
                ...testConfig,
                minRetracementPercent: 50
            };

            // Spike: 99.5 → 106 (range 6.5)
            // Correction: only drops to 105 (~15% retracement, need 50%)
            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(105, 105.5, 104.5, 105.2, 4),
                candle(105.2, 105.5, 104.8, 105, 5),
                candle(105, 105.3, 104.5, 104.8, 6)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, config);

            expect(twoLeg).toBeNull();
        });

        it("returns null when retracement too deep", () => {
            const detector = new TwoLegDetector();

            const config: StrategyAConfiguration = {
                ...testConfig,
                maxRetracementPercent: 50
            };

            // Spike: 99.5 → 106 (range 6.5)
            // Correction: drops to 100 (~92% retracement, need max 50%)
            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(103, 104, 102, 102.5, 4),
                candle(102, 102.5, 100.5, 100.8, 5),
                candle(100.5, 101, 99.5, 99.8, 6)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, config);

            expect(twoLeg).toBeNull();
        });
    });

    describe("edge cases", () => {

        it("returns null when spikeRange is zero", () => {
            const detector = new TwoLegDetector();

            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(103, 104, 102, 102.8, 4),
                candle(102.5, 103, 102, 102.2, 5)
            ];

            const spike = makeSpike("BUY", 0, 2, 106, 106);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).toBeNull();
        });

        it("returns correct completionIndex", () => {
            const detector = new TwoLegDetector();

            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(103, 103.5, 102.5, 102.8, 4),
                candle(102.5, 103, 102, 102.2, 5),
                candle(102.2, 102.5, 101.5, 101.8, 6)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).not.toBeNull();
            expect(twoLeg!.completionIndex).toBeGreaterThanOrEqual(3);
        });

        it("returns correct retracementPercent", () => {
            const detector = new TwoLegDetector();

            const candles: StrategyACandle[] = [
                candle(100, 101, 99.5, 101, 1),
                candle(102, 103.5, 101.5, 103.5, 2),
                candle(104, 106, 103.5, 106, 3),
                candle(103, 103.5, 102.5, 102.8, 4),
                candle(102.5, 103, 102, 102.2, 5),
                candle(102.2, 102.5, 101.5, 101.8, 6)
            ];

            const spike = makeSpike("BUY", 0, 2, 99.5, 106);

            const twoLeg = detector.detect(candles, spike, testConfig);

            expect(twoLeg).not.toBeNull();
            expect(twoLeg!.retracementPercent).toBeGreaterThan(0);
            expect(twoLeg!.retracementPercent).toBeLessThan(100);
        });
    });
});
