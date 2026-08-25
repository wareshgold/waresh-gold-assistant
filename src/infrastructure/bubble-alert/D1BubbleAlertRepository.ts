import { BubbleAlert } from "../../domain/bubble-alert/entities/BubbleAlert";
import { BubbleAlertRepository } from "../../domain/bubble-alert/repositories/BubbleAlertRepository";

export class D1BubbleAlertRepository implements BubbleAlertRepository {
    constructor(private readonly db: D1Database) {}

    async save(alert: BubbleAlert): Promise<void> {
        await this.db.prepare(`
            INSERT INTO bubble_alerts (user_id, threshold_percent, enabled, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                threshold_percent = excluded.threshold_percent,
                enabled = excluded.enabled
        `).bind(
            alert.userId,
            alert.thresholdPercent,
            alert.enabled ? 1 : 0,
            Date.now()
        ).run();
    }

    async get(userId: string): Promise<BubbleAlert | null> {
        const result = await this.db.prepare(`
            SELECT user_id, threshold_percent, enabled, last_notified_at
            FROM bubble_alerts
            WHERE user_id = ?
            LIMIT 1
        `).bind(userId).all<{
            user_id: string;
            threshold_percent: number;
            enabled: number;
            last_notified_at: number | null;
        }>();

        const row = result.results?.[0];
        if (!row) return null;

        return new BubbleAlert(
            row.user_id,
            row.threshold_percent,
            row.enabled === 1,
            row.last_notified_at ? new Date(row.last_notified_at) : null
        );
    }

    async getDueAlerts(now: Date): Promise<BubbleAlert[]> {
        const result = await this.db.prepare(`
            SELECT user_id, threshold_percent, enabled, last_notified_at
            FROM bubble_alerts
            WHERE enabled = 1
        `).all<{
            user_id: string;
            threshold_percent: number;
            enabled: number;
            last_notified_at: number | null;
        }>();

        return (result.results ?? [])
            .map(row => new BubbleAlert(
                row.user_id,
                row.threshold_percent,
                row.enabled === 1,
                row.last_notified_at ? new Date(row.last_notified_at) : null
            ))
            .filter(alert => alert.isDue(now));
    }

    async disable(userId: string): Promise<void> {
        await this.db.prepare(`
            UPDATE bubble_alerts SET enabled = 0 WHERE user_id = ?
        `).bind(userId).run();
    }

    async markNotified(userId: string, now: Date): Promise<void> {
        await this.db.prepare(`
            UPDATE bubble_alerts SET last_notified_at = ? WHERE user_id = ?
        `).bind(now.getTime(), userId).run();
    }
}
