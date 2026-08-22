import {
    describe,
    expect,
    it
} from "vitest";

import {
    OunceCandleAggregator
} from "./OunceCandleAggregator";

describe("OunceCandleAggregator", () => {

    it("builds M5 OHLC from ticks", () => {
        const aggregator =
            new OunceCandleAggregator(5);

        const base =
            Date.UTC(2026, 7, 20, 10, 0, 0);

        const candles =
            aggregator.buildCandles([
                {
                    price: 4492.4,
                    timestamp: base + 10_000
                },
                {
                    price: 4493.0,
                    timestamp: base + 60_000
                },
                {
                    price: 4491.5,
                    timestamp: base + 120_000
                },
                {
                    price: 4492.8,
                    timestamp: base + 200_000
                }
            ]);

        expect(candles).toHaveLength(1);
        expect(candles[0].open).toBe(4492.4);
        expect(candles[0].high).toBe(4493.0);
        expect(candles[0].low).toBe(4491.5);
        expect(candles[0].close).toBe(4492.8);
    });
});