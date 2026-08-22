import { GoldPriceAlert } from "../entities/GoldPriceAlert";

export interface GoldPriceAlertRepository {
    get(userId: string): Promise<GoldPriceAlert | null>;
    save(alert: GoldPriceAlert): Promise<void>;
    listDue(now: Date): Promise<GoldPriceAlert[]>;
    claim(userId: string, now: Date, claimUntil: Date): Promise<boolean>;
    markNotified(userId: string, notifiedAt: Date): Promise<void>;
    releaseClaim(userId: string): Promise<void>;
}
