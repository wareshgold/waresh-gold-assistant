import {
    SP2LSignalEngine
} from "../../../domain/sp2l/services/SP2LSignalEngine";

import {
    Sp2lMarketDataProvider
} from "../../../domain/sp2l/providers/Sp2lMarketDataProvider";

import {
    SP2LSignalRepository
} from "../../../domain/sp2l/repositories/SP2LSignalRepository";

import {
    SP2LSignal
} from "../../../domain/sp2l/entities/SP2LSignal";

import {
    DEFAULT_SP2L_CONFIGURATION,
    SP2LConfiguration
} from "../../../domain/sp2l/value-objects/SP2LConfiguration";

export interface SP2LEvaluationResult {
    signal: SP2LSignal;
    stored: boolean;
}

export class SP2LStrategyService {

    constructor(
        private readonly engine: SP2LSignalEngine,
        private readonly marketDataProvider: Sp2lMarketDataProvider,
        private readonly signalRepository: SP2LSignalRepository,
        private readonly config: SP2LConfiguration =
            DEFAULT_SP2L_CONFIGURATION
    ) {}

    async evaluateAndStore(): Promise<SP2LSignal> {
        const result =
            await this.evaluateAndStoreWithResult();

        return result.signal;
    }

    async evaluateAndStoreWithResult(): Promise<SP2LEvaluationResult> {
        const marketData =
            await this.marketDataProvider.getMarketData(
                this.config.symbol,
                this.config.timeframe
            );

        const signal =
            this.engine.evaluate(
                marketData,
                this.config
            );

        const stored =
            await this.signalRepository.save(signal);

        return {
            signal,
            stored
        };
    }

    async getLatestSignal(): Promise<SP2LSignal | null> {
        return this.signalRepository.getLatest(
            this.config.symbol
        );
    }
}
