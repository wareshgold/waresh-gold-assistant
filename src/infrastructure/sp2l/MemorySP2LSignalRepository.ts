import {
    SP2LSignal
} from "../../domain/sp2l/entities/SP2LSignal";

import {
    SP2LSignalRepository
} from "../../domain/sp2l/repositories/SP2LSignalRepository";

export class MemorySP2LSignalRepository
    implements SP2LSignalRepository {

    private readonly latestBySymbol =
        new Map<string, SP2LSignal>();

    async save(
        signal: SP2LSignal
    ): Promise<void> {
        this.latestBySymbol.set(
            signal.symbol,
            signal
        );
    }

    async getLatest(
        symbol: string
    ): Promise<SP2LSignal | null> {
        return this.latestBySymbol.get(symbol) ?? null;
    }
}