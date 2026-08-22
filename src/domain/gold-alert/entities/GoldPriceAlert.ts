import {
    GoldPriceAlertInterval
} from "../value-objects/GoldPriceAlertInterval";

export class GoldPriceAlert {
    constructor(
        public readonly userId: string,
        public readonly intervalHours: GoldPriceAlertInterval,
        public readonly enabled: boolean,
        public readonly lastNotifiedAt: Date | null = null,
        public readonly claimUntil: Date | null = null
    ) {
        if (!userId.trim()) {
            throw new Error("Gold price alert user id is required");
        }
    }

    isDue(now: Date): boolean {
        if (!this.enabled) return false;
        if (this.claimUntil && this.claimUntil > now) return false;
        if (!this.lastNotifiedAt) return true;
        return now.getTime() - this.lastNotifiedAt.getTime()
            >= this.intervalHours * 60 * 60 * 1000;
    }
}
