import {
    StrategyAMarketDataProvider
} from "../../domain/strategy-a/providers/StrategyAMarketDataProvider";

import {
    StrategyAMarketData
} from "../../domain/strategy-a/value-objects/StrategyAMarketData";

export class MockStrategyAMarketDataProvider
    implements StrategyAMarketDataProvider {

    async getMarketData(
        symbol: string,
        timeframe: string
    ): Promise<StrategyAMarketData> {
        const now =
            Date.now();

        const base =
            2650;

        return {
            symbol,
            timeframe,
            fetchedAt: new Date(),
            candles: [
                {
                    open: base,
                    high: base + 2,
                    low: base - 1,
                    close: base + 0.5,
                    timestamp: now - 3 * 15 * 60 * 1000
                },
                {
                    open: base + 0.5,
                    high: base + 3,
                    low: base,
                    close: base + 1.2,
                    timestamp: now - 2 * 15 * 60 * 1000
                },
                {
                    open: base + 1.2,
                    high: base + 5,
                    low: base + 1,
                    close: base + 4,
                    timestamp: now - 15 * 60 * 1000
                }
            ]
        };
    }
}