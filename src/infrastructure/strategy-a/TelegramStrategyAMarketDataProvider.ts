import {
    StrategyAMarketDataProvider
} from "../../domain/strategy-a/providers/StrategyAMarketDataProvider";

import {
    StrategyAMarketData
} from "../../domain/strategy-a/value-objects/StrategyAMarketData";

import {
    OunceTickRepository
} from "../../domain/strategy-a/repositories/OunceTickRepository";

import {
    OunceCandleAggregator
} from "../../domain/strategy-a/services/OunceCandleAggregator";

export class TelegramStrategyAMarketDataProvider
    implements StrategyAMarketDataProvider {

    constructor(
        private readonly tickRepository: OunceTickRepository,
        private readonly candleAggregator: OunceCandleAggregator =
            new OunceCandleAggregator(5)
    ) {}

    async getMarketData(
        symbol: string,
        timeframe: string
    ): Promise<StrategyAMarketData> {
        const hoursBack = 6;
        const since =
            Date.now() -
            hoursBack * 60 * 60 * 1000;

        const ticks =
            await this.tickRepository.getSince(
                since
            );

        const candles =
            this.candleAggregator.buildCandles(
                ticks
            );

        return {
            symbol,
            timeframe,
            candles,
            fetchedAt: new Date()
        };
    }
}