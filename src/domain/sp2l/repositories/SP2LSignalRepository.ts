import type { SP2LSignal } from "../entities/SP2LSignal";
import type { SP2LSignalIdentity } from "../value-objects/SP2LSignalIdentity";

export interface SP2LSignalRepository {
    save(signal: SP2LSignal): Promise<boolean>;
    getLatest(symbol: string): Promise<SP2LSignal | null>;
    findByIdentity(identity: SP2LSignalIdentity): Promise<SP2LSignal | null>;
}
