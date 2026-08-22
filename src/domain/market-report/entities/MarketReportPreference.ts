import { MarketReportInterval } from "../value-objects/MarketReportInterval";

export class MarketReportPreference {
    constructor(
        public readonly userId: string,
        public readonly intervalHours: MarketReportInterval,
        public readonly enabled: boolean,
        public readonly lastReportedAt: Date | null = null,
        public readonly claimUntil: Date | null = null
    ) {
        if (!userId.trim()) {
            throw new Error("Market report user id is required");
        }
    }

    configure(intervalHours: MarketReportInterval): MarketReportPreference {
        return new MarketReportPreference(
            this.userId,
            intervalHours,
            true,
            this.lastReportedAt,
            null
        );
    }

    disable(): MarketReportPreference {
        return new MarketReportPreference(
            this.userId,
            this.intervalHours,
            false,
            this.lastReportedAt,
            null
        );
    }
}
