import {
    GoldPriceAlert
} from "../../domain/gold-alert/entities/GoldPriceAlert";

import {
    GoldPriceAlertRepository
} from "../../domain/gold-alert/repositories/GoldPriceAlertRepository";

export class MemoryGoldPriceAlertRepository
implements GoldPriceAlertRepository {
    private readonly alerts = new Map<string, GoldPriceAlert>();

    async get(userId: string): Promise<GoldPriceAlert | null> {
        return this.alerts.get(userId) ?? null;
    }

    async save(alert: GoldPriceAlert): Promise<void> {
        this.alerts.set(alert.userId, alert);
    }

    async listDue(now: Date): Promise<GoldPriceAlert[]> {
        return [...this.alerts.values()].filter(
            alert => alert.isDue(now)
        );
    }

    async claim(
        userId: string,
        now: Date,
        claimUntil: Date
    ): Promise<boolean> {
        const alert = this.alerts.get(userId);
        if (!alert || !alert.isDue(now)) return false;

        this.alerts.set(
            userId,
            new GoldPriceAlert(
                alert.userId,
                alert.intervalHours,
                alert.enabled,
                alert.lastNotifiedAt,
                claimUntil
            )
        );

        return true;
    }

    async markNotified(userId: string, notifiedAt: Date): Promise<void> {
        const alert = this.alerts.get(userId);
        if (!alert) return;

        this.alerts.set(
            userId,
            new GoldPriceAlert(
                alert.userId,
                alert.intervalHours,
                alert.enabled,
                notifiedAt,
                null
            )
        );
    }

    async releaseClaim(userId: string): Promise<void> {
        const alert = this.alerts.get(userId);
        if (!alert) return;

        this.alerts.set(
            userId,
            new GoldPriceAlert(
                alert.userId,
                alert.intervalHours,
                alert.enabled,
                alert.lastNotifiedAt,
                null
            )
        );
    }
}
