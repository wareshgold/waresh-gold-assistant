import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

import {
    StrategyASignalRepository
} from "../../domain/strategy-a/repositories/StrategyASignalRepository";

import {
    StrategyASignalIdentity
} from "../../domain/strategy-a/value-objects/StrategyASignalIdentity";

export class MemoryStrategyASignalRepository
    implements StrategyASignalRepository {

    private readonly latestBySymbol =
        new Map<string, StrategyASignal>();

    private readonly fingerprints =
        new Set<string>();

    async save(
        signal: StrategyASignal
    ): Promise<boolean> {
        const fingerprint =
            signal.getFingerprint();

        if (this.fingerprints.has(fingerprint)) {
            return false;
        }

        this.fingerprints.add(fingerprint);
        this.latestBySymbol.set(
            signal.symbol,
            signal
        );

        return true;
    }

    async findByIdentity(
        identity: StrategyASignalIdentity
    ): Promise<StrategyASignal | null> {
        const signal =
            this.latestBySymbol.get(identity.symbol);

        if (!signal) return null;

        return (
            signal.timeframe === identity.timeframe &&
            signal.signalType === identity.signalType &&
            signal.entryPrice === identity.entryPrice &&
            signal.strategyVersion === identity.strategyVersion &&
            signal.generatedAt.getTime() === identity.generatedAt
        )
            ? signal
            : null;
    }

    async getLatest(
        symbol: string
    ): Promise<StrategyASignal | null> {
        return this.latestBySymbol.get(symbol) ?? null;
    }
}
