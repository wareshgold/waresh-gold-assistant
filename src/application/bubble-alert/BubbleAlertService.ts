import { BubbleAlert } from "../../domain/bubble-alert/entities/BubbleAlert";
import { BubbleAlertRepository } from "../../domain/bubble-alert/repositories/BubbleAlertRepository";

export class BubbleAlertService {
    constructor(private readonly repository: BubbleAlertRepository) {}

    async configure(userId: string, thresholdPercent: number): Promise<BubbleAlert> {
        const alert = new BubbleAlert(userId, thresholdPercent, true);
        await this.repository.save(alert);
        return alert;
    }

    async get(userId: string): Promise<BubbleAlert | null> {
        return this.repository.get(userId);
    }

    async disable(userId: string): Promise<void> {
        await this.repository.disable(userId);
    }

    async getDueAlerts(now: Date): Promise<BubbleAlert[]> {
        return this.repository.getDueAlerts(now);
    }

    async markNotified(userId: string, now: Date): Promise<void> {
        await this.repository.markNotified(userId, now);
    }
}
