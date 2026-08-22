import { MarketReportPreference } from "../entities/MarketReportPreference";

export interface MarketReportPreferenceRepository {
    get(userId: string): Promise<MarketReportPreference | null>;
    save(preference: MarketReportPreference): Promise<void>;
    listDue(now: Date): Promise<MarketReportPreference[]>;
    claim(userId: string, now: Date, claimUntil: Date): Promise<boolean>;
    markReported(userId: string, reportedAt: Date): Promise<void>;
    releaseClaim(userId: string): Promise<void>;
}
