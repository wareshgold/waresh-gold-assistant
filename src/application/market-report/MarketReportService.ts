import { MarketReportPreference } from "../../domain/market-report/entities/MarketReportPreference";
import { MarketReportPreferenceRepository } from "../../domain/market-report/repositories/MarketReportPreferenceRepository";
import { MarketReportInterval } from "../../domain/market-report/value-objects/MarketReportInterval";

export class MarketReportService {
    constructor(
        private readonly repository: MarketReportPreferenceRepository
    ) {}

    async get(userId: string): Promise<MarketReportPreference | null> {
        return this.repository.get(userId);
    }

    async configure(
        userId: string,
        intervalHours: MarketReportInterval
    ): Promise<void> {
        const current = await this.repository.get(userId);
        const preference = current
            ? current.configure(intervalHours)
            : new MarketReportPreference(userId, intervalHours, true);

        await this.repository.save(preference);
    }

    async disable(userId: string): Promise<void> {
        const current = await this.repository.get(userId);
        if (!current) return;
        await this.repository.save(current.disable());
    }

    async getDueReports(now: Date): Promise<MarketReportPreference[]> {
        return this.repository.listDue(now);
    }

    async claimDue(
        preference: MarketReportPreference,
        now: Date
    ): Promise<boolean> {
        const claimUntil = new Date(now.getTime() + 5 * 60 * 1000);
        return this.repository.claim(
            preference.userId,
            now,
            claimUntil
        );
    }

    async markReported(userId: string, reportedAt: Date): Promise<void> {
        await this.repository.markReported(userId, reportedAt);
    }

    async releaseClaim(userId: string): Promise<void> {
        await this.repository.releaseClaim(userId);
    }
}
