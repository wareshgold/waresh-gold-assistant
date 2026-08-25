import { BubbleAlert } from "../entities/BubbleAlert";

export interface BubbleAlertRepository {
    save(alert: BubbleAlert): Promise<void>;
    get(userId: string): Promise<BubbleAlert | null>;
    getDueAlerts(now: Date): Promise<BubbleAlert[]>;
    disable(userId: string): Promise<void>;
    markNotified(userId: string, now: Date): Promise<void>;
}
