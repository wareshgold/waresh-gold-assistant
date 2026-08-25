import {
    StrategyASignal
} from "../../domain/strategy-a/entities/StrategyASignal";

import {
    StrategyASignalRepository
} from "../../domain/strategy-a/repositories/StrategyASignalRepository";

import {
    StrategyASignalIdentity
} from "../../domain/strategy-a/value-objects/StrategyASignalIdentity";

import {
    SignalStatus
} from "../../domain/strategy-a/value-objects/SignalStatus";

export class MemoryStrategyASignalRepository
    implements StrategyASignalRepository {

    private readonly latestBySymbol =
        new Map<string, StrategyASignal>();

    private readonly fingerprints =
        new Set<string>();

    private readonly allSignals: StrategyASignal[] = [];
    private nextId = 1;

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
        this.allSignals.push(signal);

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

    async getActiveSignals(): Promise<StrategyASignal[]> {
        return this.allSignals.filter(
            s => s.isActionable() && s.status === "ACTIVE"
        );
    }

    async updateStatus(
        signalId: number,
        status: SignalStatus
    ): Promise<void> {
        // Memory implementation is simplified
    }
}
