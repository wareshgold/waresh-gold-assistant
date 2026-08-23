import {
    OunceTick
} from "../value-objects/OunceTick";

import {
    StrategyACandle
} from "../value-objects/StrategyAMarketData";

export class OunceCandleAggregator {

    constructor(
        private readonly timeframeMinutes: number = 5
    ) {}

    buildCandles(
        ticks: OunceTick[]
    ): StrategyACandle[] {
        if (ticks.length === 0) {
            return [];
        }

        const sorted = [...ticks].sort(
            (a, b) => a.timestamp - b.timestamp
        );

        const bucketMs =
            this.timeframeMinutes * 60 * 1000;

        const buckets =
            new Map<number, OunceTick[]>();

        for (const tick of sorted) {
            const bucketStart =
                Math.floor(tick.timestamp / bucketMs) *
                bucketMs;

            const list =
                buckets.get(bucketStart) ?? [];

            list.push(tick);
            buckets.set(bucketStart, list);
        }

        const candles: StrategyACandle[] = [];

        for (const [bucketStart, bucketTicks] of [...buckets.entries()].sort(
            (a, b) => a[0] - b[0]
        )) {
            const prices =
                bucketTicks.map(t => t.price);

            candles.push({
                open: prices[0],
                high: Math.max(...prices),
                low: Math.min(...prices),
                close: prices[prices.length - 1],
                volume: bucketTicks.length,
                timestamp: bucketStart
            });
        }

        return candles;
    }
}