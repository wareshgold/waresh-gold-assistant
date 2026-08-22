import {
    GoldPriceAlert
} from "../../domain/gold-alert/entities/GoldPriceAlert";

import {
    GoldPriceAlertInterval,
    isGoldPriceAlertInterval
} from "../../domain/gold-alert/value-objects/GoldPriceAlertInterval";

import {
    GoldPriceAlertRepository
} from "../../domain/gold-alert/repositories/GoldPriceAlertRepository";

export class GoldPriceAlertService {
    constructor(
        private readonly repository: GoldPriceAlertRepository
    ) {}

    async get(userId: string): Promise<GoldPriceAlert | null> {
        return this.repository.get(userId);
    }

    async configure(
        userId: string,
        intervalHours: number
    ): Promise<GoldPriceAlert> {
        if (!isGoldPriceAlertInterval(intervalHours)) {
            throw new Error("Unsupported gold price alert interval");
        }

        const alert = new GoldPriceAlert(
            userId,
            intervalHours as GoldPriceAlertInterval,
            true,
            null,
            null
        );

        await this.repository.save(alert);
        return alert;
    }

    async disable(userId: string): Promise<void> {
        const current = await this.repository.get(userId);
        if (!current) return;

        await this.repository.save(
            new GoldPriceAlert(
                userId,
                current.intervalHours,
                false,
                current.lastNotifiedAt,
                null
            )
        );
    }

    async claimDue(
        alert: GoldPriceAlert,
        now: Date,
        claimMinutes = 5
    ): Promise<boolean> {
        return this.repository.claim(
            alert.userId,
            now,
            new Date(now.getTime() + claimMinutes * 60 * 1000)
        );
    }

    async markNotified(userId: string, now: Date): Promise<void> {
        await this.repository.markNotified(userId, now);
    }

    async releaseClaim(userId: string): Promise<void> {
        await this.repository.releaseClaim(userId);
    }
}
