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

import {
    TelegramOunceMessageProvider
} from "./TelegramOunceMessageProvider";

export class TelegramSp2lMarketDataProvider
    implements Sp2lMarketDataProvider {

    constructor(
        private readonly messageProvider: TelegramOunceMessageProvider,
        private readonly tickRepository: OunceTickRepository,
        private readonly candleAggregator: OunceCandleAggregator =
            new OunceCandleAggregator(5)
    ) {}

    async getMarketData(
        symbol: string,
        timeframe: string
    ): Promise<SP2LMarketData> {
        try {
            const tick =
                await this.messageProvider.getLatestTick();

            await this.tickRepository.save(
                tick
            );
        } catch (error) {
            console.error(
                "OUNCE_TICK_FETCH_FAILED",
                error
            );
        }

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