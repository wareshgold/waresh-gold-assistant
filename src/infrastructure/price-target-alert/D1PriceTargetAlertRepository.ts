import { PriceTargetAlert } from "../../domain/price-target-alert/entities/PriceTargetAlert";
import { PriceTargetAlertRepository } from "../../domain/price-target-alert/repositories/PriceTargetAlertRepository";

interface PriceTargetAlertRow {
    id: string;
    user_id: string;
    target_price: number;
    direction: string;
    active: number;
    created_at: string;
    notified_at: string | null;
}

export class D1PriceTargetAlertRepository implements PriceTargetAlertRepository {
    constructor(private readonly db: D1Database) {}

    async getByUser(userId: string): Promise<PriceTargetAlert[]> {
        const { results } = await this.db
            .prepare(
                `SELECT * FROM price_target_alerts
                 WHERE user_id = ?
                 ORDER BY created_at DESC`
            )
            .bind(userId)
            .all<PriceTargetAlertRow>();

        return results.map(this.toEntity);
    }

    async getActive(): Promise<PriceTargetAlert[]> {
        const { results } = await this.db
            .prepare(
                `SELECT * FROM price_target_alerts
                 WHERE active = 1`
            )
            .all<PriceTargetAlertRow>();

        return results.map(this.toEntity);
    }

    async save(alert: PriceTargetAlert): Promise<void> {
        await this.db
            .prepare(
                `INSERT OR REPLACE INTO price_target_alerts
                 (id, user_id, target_price, direction, active, created_at, notified_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
            )
            .bind(
                alert.id,
                alert.userId,
                alert.targetPrice,
                alert.direction,
                alert.active ? 1 : 0,
                alert.createdAt.toISOString(),
                alert.notifiedAt?.toISOString() ?? null
            )
            .run();
    }

    async delete(alertId: string): Promise<void> {
        await this.db
            .prepare(
                `DELETE FROM price_target_alerts WHERE id = ?`
            )
            .bind(alertId)
            .run();
    }

    async markNotified(alertId: string): Promise<void> {
        await this.db
            .prepare(
                `UPDATE price_target_alerts
                 SET active = 0, notified_at = ?
                 WHERE id = ?`
            )
            .bind(new Date().toISOString(), alertId)
            .run();
    }

    private toEntity(row: PriceTargetAlertRow): PriceTargetAlert {
        return new PriceTargetAlert({
            id: row.id,
            userId: row.user_id,
            targetPrice: row.target_price,
            direction: row.direction as "ABOVE" | "BELOW",
            active: row.active === 1,
            createdAt: new Date(row.created_at),
            notifiedAt: row.notified_at ? new Date(row.notified_at) : null
        });
    }
}
