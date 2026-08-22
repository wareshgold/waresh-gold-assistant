import {
    SP2LSignal
} from "../entities/SP2LSignal";

export interface SP2LSignalRepository {
    save(
        signal: SP2LSignal
    ): Promise<boolean>;

    getLatest(
        symbol: string
    ): Promise<SP2LSignal | null>;
}
