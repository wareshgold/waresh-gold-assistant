import { PriceTargetAlert } from "../../domain/price-target-alert/entities/PriceTargetAlert";
import { PriceTargetAlertRepository } from "../../domain/price-target-alert/repositories/PriceTargetAlertRepository";

export class PriceTargetAlertService {
    constructor(
        private readonly repository: PriceTargetAlertRepository
    ) {}

    async getByUser(userId: string): Promise<PriceTargetAlert[]> {
        return this.repository.getByUser(userId);
    }

    async getActiveByUser(userId: string): Promise<PriceTargetAlert[]> {
        const alerts = await this.repository.getByUser(userId);
        return alerts.filter(a => a.active);
    }

    async create(
        userId: string,
        targetPrice: number,
        direction: "ABOVE" | "BELOW"
    ): Promise<PriceTargetAlert> {
        const alert = PriceTargetAlert.create(userId, targetPrice, direction);
        await this.repository.save(alert);
        return alert;
    }

    async cancel(alertId: string): Promise<void> {
        await this.repository.delete(alertId);
    }

    async cancelAll(userId: string): Promise<void> {
        const alerts = await this.repository.getByUser(userId);
        for (const alert of alerts) {
            if (alert.active) {
                await this.repository.delete(alert.id);
            }
        }
    }

    async checkAndNotify(
        currentPrice: number
    ): Promise<{ alert: PriceTargetAlert; userId: string }[]> {
        const activeAlerts = await this.repository.getActive();
        const notified: { alert: PriceTargetAlert; userId: string }[] = [];

        for (const alert of activeAlerts) {
            if (alert.shouldNotify(currentPrice)) {
                await this.repository.markNotified(alert.id);
                notified.push({ alert, userId: alert.userId });
            }
        }

        return notified;
    }
}
