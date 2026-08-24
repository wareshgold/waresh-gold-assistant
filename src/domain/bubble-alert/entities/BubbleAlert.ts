export class BubbleAlert {
    constructor(
        public readonly userId: string,
        public readonly thresholdPercent: number,
        public readonly enabled: boolean = true,
        public readonly lastNotifiedAt: Date | null = null,
        public readonly claimUntil: Date | null = null
    ) {
        if (!userId.trim()) {
            throw new Error("Bubble alert user id is required");
        }
        if (thresholdPercent <= 0) {
            throw new Error("Threshold must be positive");
        }
    }

    /**
     * Check if bubble percentage exceeds the threshold.
     * Returns the alert type if threshold is breached, null otherwise.
     */
    checkBubble(
        bubblePercent: number
    ): "POSITIVE" | "NEGATIVE" | null {
        if (bubblePercent >= this.thresholdPercent) {
            return "POSITIVE";
        }
        if (bubblePercent <= -this.thresholdPercent) {
            return "NEGATIVE";
        }
        return null;
    }

    isDue(now: Date): boolean {
        if (!this.enabled) return false;
        if (this.claimUntil && this.claimUntil > now) return false;
        if (!this.lastNotifiedAt) return true;
        // Once per hour for bubble alerts
        return now.getTime() - this.lastNotifiedAt.getTime()
            >= 60 * 60 * 1000;
    }
}
