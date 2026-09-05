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
        gapSize: 2,
        candlesCount: 3,
        extremeHigh: Math.max(startPrice, endPrice) + 1,
        extremeLow: Math.min(startPrice, endPrice) - 1
    };
}

describe("TwoLegDetector", () => {
    it("detects a genuine BUY two-leg correction with a retracement between legs", () => {
        const detector = new TwoLegDetector();

        const candles = [
            candle(100, 101, 99.5, 101, 1),
            candle(102, 103.5, 101.5, 103.5, 2),
            candle(104, 106, 103.5, 106, 3),
            // Leg 1: down to 101.5
            candle(105.5, 105.8, 101.5, 102, 4),
            // Retracement: upward counter-move
            candle(102, 103.8, 101.8, 103.5, 5),
            // Leg 2: new low below leg 1; close is the entry price
            candle(103.5, 103.8, 101, 101.2, 6),
            // Newest closed candle is not needed for entry
            candle(101.2, 102.8, 101.1, 102.6, 7)
        ];

        const twoLeg = detector.detect(
            candles,
            makeSpike("BUY", 0, 2, 99.5, 106),
            testConfig
        );

        expect(twoLeg).not.toBeNull();
        expect(twoLeg!.leg1.endIndex).toBe(3);
        expect(twoLeg!.leg2.endIndex).toBe(5);
        expect(twoLeg!.completionIndex).toBe(5);
        expect(twoLeg!.completionPrice).toBe(101.2);
        expect(twoLeg!.retracementPercent).toBeGreaterThan(20);
        expect(twoLeg!.retracementPercent).toBeLessThan(85);
    });

    it("detects a genuine SELL two-leg correction with a retracement between legs", () => {
        const detector = new TwoLegDetector();

        const candles = [
            candle(106, 106.5, 104, 104, 1),
            candle(103.5, 104, 102, 102, 2),
            candle(101, 101.5, 100, 100, 3),
            // Leg 1: up to 104.5
            candle(100.2, 104.5, 100, 104, 4),
            // Retracement: downward counter-move
            candle(104, 104.2, 102.8, 103, 5),
            // Leg 2: new high above leg 1; close is the entry price
            candle(103, 105, 102.8, 104.8, 6),
            // Newest closed candle is not needed for entry
            candle(104.8, 104.9, 102.5, 102.7, 7)
        ];

        const twoLeg = detector.detect(
            candles,
            makeSpike("SELL", 0, 2, 106, 100),
            testConfig
        );

        expect(twoLeg).not.toBeNull();
        expect(twoLeg!.leg1.endIndex).toBe(3);
        expect(twoLeg!.leg2.endIndex).toBe(5);
        expect(twoLeg!.completionPrice).toBe(104.8);
        expect(twoLeg!.retracementPercent).toBeGreaterThan(20);
        expect(twoLeg!.retracementPercent).toBeLessThan(85);
    });

    it("rejects a single continuous correction without an intervening retracement", () => {
        const detector = new TwoLegDetector();

        const candles = [
            candle(100, 101, 99.5, 101, 1),
            candle(102, 103.5, 101.5, 103.5, 2),
            candle(104, 106, 103.5, 106, 3),
            candle(103, 103.5, 102.5, 102.8, 4),
            candle(102.5, 103, 102, 102.2, 5),
            candle(102.2, 102.5, 101.5, 101.8, 6),
            candle(101.8, 102, 101, 101.2, 7)
        ];

        const twoLeg = detector.detect(
            candles,
            makeSpike("BUY", 0, 2, 99.5, 106),
            testConfig
        );

        expect(twoLeg).toBeNull();
    });

    it("rejects a correction when retracement is too shallow", () => {
        const detector = new TwoLegDetector();
        const config = {
            ...testConfig,
            minRetracementPercent: 50
        };

        const candles = [
            candle(100, 101, 99.5, 101, 1),
            candle(102, 103.5, 101.5, 103.5, 2),
            candle(104, 106, 103.5, 106, 3),
            candle(105.5, 105.8, 103.8, 104, 4),
            candle(104, 104.8, 103.9, 104.5, 5),
            candle(104.5, 104.8, 103.6, 103.8, 6),
            candle(103.8, 105, 103.7, 104.8, 7)
        ];

        const twoLeg = detector.detect(
            candles,
            makeSpike("BUY", 0, 2, 99.5, 106),
            config
        );

        expect(twoLeg).toBeNull();
    });

    it("rejects a correction when no candle remains to complete the second leg", () => {
        const detector = new TwoLegDetector();

        const candles = [
            candle(100, 101, 99.5, 101, 1),
            candle(102, 103.5, 101.5, 103.5, 2),
            candle(104, 106, 103.5, 106, 3),
            candle(105.5, 105.8, 101.5, 102, 4),
            candle(102, 103.8, 101.8, 103.5, 5)
        ];

        const twoLeg = detector.detect(
            candles,
            makeSpike("BUY", 0, 2, 99.5, 106),
            testConfig
        );

        expect(twoLeg).toBeNull();
    });
});
