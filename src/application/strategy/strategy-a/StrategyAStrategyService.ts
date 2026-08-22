import { StrategyASignalEngine } from "../../../domain/strategy-a/services/StrategyASignalEngine";
import { StrategyAMarketDataProvider } from "../../../domain/strategy-a/providers/StrategyAMarketDataProvider";
import { StrategyASignalRepository } from "../../../domain/strategy-a/repositories/StrategyASignalRepository";
import { StrategyASignal } from "../../../domain/strategy-a/entities/StrategyASignal";
import {
    createStrategyASignalIdentity,
    StrategyASignalIdentity
} from "../../../domain/strategy-a/value-objects/StrategyASignalIdentity";
import {
    DEFAULT_StrategyA_CONFIGURATION,
    StrategyAConfiguration
} from "../../../domain/strategy-a/value-objects/StrategyAConfiguration";

export interface StrategyAEvaluationResult {
    signal: StrategyASignal;
    stored: boolean;
    alreadyStored: boolean;
}

export class StrategyAStrategyService {
    constructor(
        private readonly engine: StrategyASignalEngine,
        private readonly marketDataProvider: StrategyAMarketDataProvider,
        private readonly signalRepository: StrategyASignalRepository,
        private readonly config: StrategyAConfiguration = DEFAULT_StrategyA_CONFIGURATION
    ) {}

    async evaluateAndStore(): Promise<StrategyASignal> {
        const result = await this.evaluateAndStoreWithResult();
        return result.signal;
    }

    async evaluateAndStoreWithResult(): Promise<StrategyAEvaluationResult> {
        const marketData = await this.marketDataProvider.getMarketData(
            this.config.symbol,
            this.config.timeframe
        );
        const signal = this.engine.evaluate(marketData, this.config);
        const identity = createStrategyASignalIdentity(signal);
        const existing = await this.signalRepository.findByIdentity(identity);

        if (existing) {
            return { signal: existing, stored: false, alreadyStored: true };
        }

        const stored = await this.signalRepository.save(signal);
        return { signal, stored, alreadyStored: false };
    }

    async getLatestSignal(): Promise<StrategyASignal | null> {
        return this.signalRepository.getLatest(this.config.symbol);
    }

    async findSignalByIdentity(identity: StrategyASignalIdentity): Promise<StrategyASignal | null> {
        return this.signalRepository.findByIdentity(identity);
    }
}
