import { PriceTargetAlert } from "../entities/PriceTargetAlert";

export interface PriceTargetAlertRepository {
    getByUser(userId: string): Promise<PriceTargetAlert[]>;
    getActive(): Promise<PriceTargetAlert[]>;
    save(alert: PriceTargetAlert): Promise<void>;
    delete(alertId: string): Promise<void>;
    markNotified(alertId: string): Promise<void>;
}
