import type { StrategyASignal } from "../entities/StrategyASignal";
import type { StrategyASignalIdentity } from "../value-objects/StrategyASignalIdentity";
import type { SignalStatus } from "../value-objects/SignalStatus";

export interface StrategyASignalRepository {
    save(signal: StrategyASignal): Promise<boolean>;
    getLatest(symbol: string): Promise<StrategyASignal | null>;
    findByIdentity(identity: StrategyASignalIdentity): Promise<StrategyASignal | null>;
    getActiveSignals(): Promise<StrategyASignal[]>;
    updateStatus(signalId: number, status: SignalStatus): Promise<void>;
}
