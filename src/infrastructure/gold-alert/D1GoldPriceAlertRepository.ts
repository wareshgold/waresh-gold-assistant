import {
    GoldPriceAlert
} from "../../domain/gold-alert/entities/GoldPriceAlert";

import {
    GoldPriceAlertInterval
} from "../../domain/gold-alert/value-objects/GoldPriceAlertInterval";

import {
    GoldPriceAlertRepository
} from "../../domain/gold-alert/repositories/GoldPriceAlertRepository";

export class D1GoldPriceAlertRepository
implements GoldPriceAlertRepository {
    constructor(
        private readonly db: D1Database
    ) {}

    async get(userId: string): Promise<GoldPriceAlert | null> {
        const row = await this.db
            .prepare(
                `SELECT user_id, interval_hours, enabled, last_notified_at, claim_until
                 FROM gold_price_alerts
                 WHERE user_id = ?1`
            )
            .bind(userId)
            .first<AlertRow>();

        return row ? this.toDomain(row) : null;
    }

    async save(alert: GoldPriceAlert): Promise<void> {
        await this.db
            .prepare(
                `INSERT INTO gold_price_alerts
                    (user_id, interval_hours, enabled, last_notified_at, claim_until)
                 VALUES (?1, ?2, ?3, ?4, ?5)
                 ON CONFLICT(user_id) DO UPDATE SET
                    interval_hours = excluded.interval_hours,
                    enabled = excluded.enabled,
                    last_notified_at = excluded.last_notified_at,
                    claim_until = excluded.claim_until`
            )
            .bind(
                alert.userId,
                alert.intervalHours,
                alert.enabled ? 1 : 0,
                alert.lastNotifiedAt?.toISOString() ?? null,
                alert.claimUntil?.toISOString() ?? null
            )
            .run();
    }

    async listDue(now: Date): Promise<GoldPriceAlert[]> {
        const result = await this.db
            .prepare(
                `SELECT user_id, interval_hours, enabled, last_notified_at, claim_until
                 FROM gold_price_alerts
                 WHERE enabled = 1
                   AND (claim_until IS NULL OR claim_until <= ?1)
                   AND (
                       last_notified_at IS NULL
                       OR datetime(last_notified_at, '+' || interval_hours || ' hours') <= datetime(?1)
                   )`
            )
            .bind(now.toISOString())
            .all<AlertRow>();

        return result.results.map(row => this.toDomain(row));
    }

    async claim(
        userId: string,
        now: Date,
        claimUntil: Date
    ): Promise<boolean> {
        const result = await this.db
            .prepare(
                `UPDATE gold_price_alerts
                 SET claim_until = ?1
                 WHERE user_id = ?2
                   AND enabled = 1
                   AND (claim_until IS NULL OR claim_until <= ?3)
                   AND (
                       last_notified_at IS NULL
                       OR datetime(last_notified_at, '+' || interval_hours || ' hours') <= datetime(?3)
                   )`
            )
            .bind(
                claimUntil.toISOString(),
                userId,
                now.toISOString()
            )
            .run();

        return result.meta.changes > 0;
    }

    async markNotified(userId: string, notifiedAt: Date): Promise<void> {
        await this.db
            .prepare(
                `UPDATE gold_price_alerts
                 SET last_notified_at = ?1,
                     claim_until = NULL
                 WHERE user_id = ?2`
            )
            .bind(notifiedAt.toISOString(), userId)
            .run();
    }

    async releaseClaim(userId: string): Promise<void> {
        await this.db
            .prepare(
                `UPDATE gold_price_alerts
                 SET claim_until = NULL
                 WHERE user_id = ?1`
            )
            .bind(userId)
            .run();
    }

    private toDomain(row: AlertRow): GoldPriceAlert {
        return new GoldPriceAlert(
            row.user_id,
            row.interval_hours as GoldPriceAlertInterval,
            row.enabled === 1,
            row.last_notified_at
                ? new Date(row.last_notified_at)
                : null,
            row.claim_until
                ? new Date(row.claim_until)
                : null
        );
    }
}

interface AlertRow {
    user_id: string;
    interval_hours: number;
    enabled: number;
    last_notified_at: string | null;
    claim_until: string | null;
}
