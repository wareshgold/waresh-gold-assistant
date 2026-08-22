import { MarketReportPreference } from "../../domain/market-report/entities/MarketReportPreference";
import { MarketReportPreferenceRepository } from "../../domain/market-report/repositories/MarketReportPreferenceRepository";
import { MarketReportInterval } from "../../domain/market-report/value-objects/MarketReportInterval";

export class D1MarketReportPreferenceRepository
implements MarketReportPreferenceRepository {
    constructor(private readonly db: D1Database) {}

    async get(userId: string): Promise<MarketReportPreference | null> {
        const row = await this.db.prepare(
            `SELECT user_id, interval_hours, enabled, last_reported_at, claim_until
             FROM market_report_preferences
             WHERE user_id = ?1`
        ).bind(userId).first<ReportRow>();

        return row ? this.toDomain(row) : null;
    }

    async save(preference: MarketReportPreference): Promise<void> {
        await this.db.prepare(
            `INSERT INTO market_report_preferences
                (user_id, interval_hours, enabled, last_reported_at, claim_until)
             VALUES (?1, ?2, ?3, ?4, ?5)
             ON CONFLICT(user_id) DO UPDATE SET
                interval_hours = excluded.interval_hours,
                enabled = excluded.enabled,
                last_reported_at = excluded.last_reported_at,
                claim_until = excluded.claim_until`
        ).bind(
            preference.userId,
            preference.intervalHours,
            preference.enabled ? 1 : 0,
            preference.lastReportedAt?.toISOString() ?? null,
            preference.claimUntil?.toISOString() ?? null
        ).run();
    }

    async listDue(now: Date): Promise<MarketReportPreference[]> {
        const result = await this.db.prepare(
            `SELECT user_id, interval_hours, enabled, last_reported_at, claim_until
             FROM market_report_preferences
             WHERE enabled = 1
               AND (claim_until IS NULL OR claim_until <= ?1)
               AND (
                   last_reported_at IS NULL
                   OR datetime(last_reported_at, '+' || interval_hours || ' hours') <= datetime(?1)
               )`
        ).bind(now.toISOString()).all<ReportRow>();

        return result.results.map(row => this.toDomain(row));
    }

    async claim(userId: string, now: Date, claimUntil: Date): Promise<boolean> {
        const result = await this.db.prepare(
            `UPDATE market_report_preferences
             SET claim_until = ?1
             WHERE user_id = ?2
               AND enabled = 1
               AND (claim_until IS NULL OR claim_until <= ?3)
               AND (
                   last_reported_at IS NULL
                   OR datetime(last_reported_at, '+' || interval_hours || ' hours') <= datetime(?3)
               )`
        ).bind(
            claimUntil.toISOString(),
            userId,
            now.toISOString()
        ).run();

        return result.meta.changes > 0;
    }

    async markReported(userId: string, reportedAt: Date): Promise<void> {
        await this.db.prepare(
            `UPDATE market_report_preferences
             SET last_reported_at = ?1,
                 claim_until = NULL
             WHERE user_id = ?2`
        ).bind(reportedAt.toISOString(), userId).run();
    }

    async releaseClaim(userId: string): Promise<void> {
        await this.db.prepare(
            `UPDATE market_report_preferences
             SET claim_until = NULL
             WHERE user_id = ?1`
        ).bind(userId).run();
    }

    private toDomain(row: ReportRow): MarketReportPreference {
        return new MarketReportPreference(
            row.user_id,
            row.interval_hours as MarketReportInterval,
            row.enabled === 1,
            row.last_reported_at ? new Date(row.last_reported_at) : null,
            row.claim_until ? new Date(row.claim_until) : null
        );
    }
}

interface ReportRow {
    user_id: string;
    interval_hours: number;
    enabled: number;
    last_reported_at: string | null;
    claim_until: string | null;
}
