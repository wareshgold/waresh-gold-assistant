import {
    Sp2lMarketDataProvider
} from "../../domain/sp2l/providers/Sp2lMarketDataProvider";

import {
    SP2LMarketData
} from "../../domain/sp2l/value-objects/SP2LMarketData";

import {
    OunceTickRepository
} from "../../domain/sp2l/repositories/OunceTickRepository";

import {
    OunceCandleAggregator
} from "../../domain/sp2l/services/OunceCandleAggregator";

export class TelegramSp2lMarketDataProvider
    implements Sp2lMarketDataProvider {

    constructor(
        private readonly tickRepository: OunceTickRepository,
        private readonly candleAggregator: OunceCandleAggregator =
            new OunceCandleAggregator(5)
    ) {}

    async getMarketData(
        symbol: string,
        timeframe: string
    ): Promise<SP2LMarketData> {
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