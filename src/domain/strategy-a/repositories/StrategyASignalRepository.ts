import type { StrategyASignal } from "../entities/StrategyASignal";
import type { StrategyASignalIdentity } from "../value-objects/StrategyASignalIdentity";

export interface StrategyASignalRepository {
    save(signal: StrategyASignal): Promise<boolean>;
    getLatest(symbol: string): Promise<StrategyASignal | null>;
    findByIdentity(identity: StrategyASignalIdentity): Promise<StrategyASignal | null>;
}
