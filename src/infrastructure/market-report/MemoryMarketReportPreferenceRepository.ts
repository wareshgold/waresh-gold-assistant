import { MarketReportPreference } from "../../domain/market-report/entities/MarketReportPreference";
import { MarketReportPreferenceRepository } from "../../domain/market-report/repositories/MarketReportPreferenceRepository";
import { MarketReportInterval } from "../../domain/market-report/value-objects/MarketReportInterval";

export class MemoryMarketReportPreferenceRepository
implements MarketReportPreferenceRepository {
    private readonly preferences = new Map<string, MarketReportPreference>();

    async get(userId: string): Promise<MarketReportPreference | null> {
        return this.preferences.get(userId) ?? null;
    }

    async save(preference: MarketReportPreference): Promise<void> {
        this.preferences.set(preference.userId, preference);
    }

    async listDue(now: Date): Promise<MarketReportPreference[]> {
        return [...this.preferences.values()].filter(preference => {
            if (!preference.enabled) return false;
            if (
                preference.claimUntil &&
                preference.claimUntil.getTime() > now.getTime()
            ) {
                return false;
            }
            if (!preference.lastReportedAt) return true;
            return (
                now.getTime() - preference.lastReportedAt.getTime() >=
                preference.intervalHours * 60 * 60 * 1000
            );
        });
    }

    async claim(
        userId: string,
        now: Date,
        claimUntil: Date
    ): Promise<boolean> {
        const current = this.preferences.get(userId);
        if (!current || !current.enabled) return false;
        if (current.claimUntil && current.claimUntil.getTime() > now.getTime()) {
            return false;
        }
        const due = !current.lastReportedAt ||
            now.getTime() - current.lastReportedAt.getTime() >=
            current.intervalHours * 60 * 60 * 1000;
        if (!due) return false;

        this.preferences.set(
            userId,
            new MarketReportPreference(
                current.userId,
                current.intervalHours as MarketReportInterval,
                current.enabled,
                current.lastReportedAt,
                claimUntil
            )
        );
        return true;
    }

    async markReported(userId: string, reportedAt: Date): Promise<void> {
        const current = this.preferences.get(userId);
        if (!current) return;
        this.preferences.set(
            userId,
            new MarketReportPreference(
                current.userId,
                current.intervalHours,
                current.enabled,
                reportedAt,
                null
            )
        );
    }

    async releaseClaim(userId: string): Promise<void> {
        const current = this.preferences.get(userId);
        if (!current) return;
        this.preferences.set(
            userId,
            new MarketReportPreference(
                current.userId,
                current.intervalHours,
                current.enabled,
                current.lastReportedAt,
                null
            )
        );
    }
}
