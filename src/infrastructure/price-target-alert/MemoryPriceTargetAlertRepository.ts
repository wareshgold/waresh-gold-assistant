import { PriceTargetAlert } from "../../domain/price-target-alert/entities/PriceTargetAlert";
import { PriceTargetAlertRepository } from "../../domain/price-target-alert/repositories/PriceTargetAlertRepository";

export class MemoryPriceTargetAlertRepository implements PriceTargetAlertRepository {
    private readonly alerts = new Map<string, PriceTargetAlert>();

    async getByUser(userId: string): Promise<PriceTargetAlert[]> {
        return Array.from(this.alerts.values())
            .filter(a => a.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getActive(): Promise<PriceTargetAlert[]> {
        return Array.from(this.alerts.values())
            .filter(a => a.active);
    }

    async save(alert: PriceTargetAlert): Promise<void> {
        this.alerts.set(alert.id, alert);
    }

    async delete(alertId: string): Promise<void> {
        this.alerts.delete(alertId);
    }

    async markNotified(alertId: string): Promise<void> {
        const alert = this.alerts.get(alertId);
        if (alert) {
            this.alerts.set(alertId, alert.markNotified());
        }
    }
}
