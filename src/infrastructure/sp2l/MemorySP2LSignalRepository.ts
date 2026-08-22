import {
    SP2LSignal
} from "../../domain/sp2l/entities/SP2LSignal";

import {
    SP2LSignalRepository
} from "../../domain/sp2l/repositories/SP2LSignalRepository";

import {
    SP2LSignalIdentity
} from "../../domain/sp2l/value-objects/SP2LSignalIdentity";

export class MemorySP2LSignalRepository
    implements SP2LSignalRepository {

    private readonly latestBySymbol =
        new Map<string, SP2LSignal>();

    private readonly fingerprints =
        new Set<string>();

    async save(
        signal: SP2LSignal
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
        identity: SP2LSignalIdentity
    ): Promise<SP2LSignal | null> {
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
    ): Promise<SP2LSignal | null> {
        return this.latestBySymbol.get(symbol) ?? null;
    }
}
