import { BubbleAlertService } from "../bubble-alert/BubbleAlertService";
import { GoldBubbleCalculator, GoldBubbleResult } from "../../domain/market/services/GoldBubbleCalculator";
import { MarketPriceProvider } from "../../domain/market/providers/MarketPriceProvider";

export interface BubbleAlertNotifier {
    send(
        userId: string,
        bubblePercent: number,
        alertType: "POSITIVE" | "NEGATIVE",
        bubbleResult: GoldBubbleResult
    ): Promise<void>;
}

export class BubbleAlertSchedulerJob {
    constructor(
        private readonly bubbleAlertService: BubbleAlertService,
        private readonly marketPriceProvider: MarketPriceProvider,
        private readonly bubbleCalculator: GoldBubbleCalculator,
        private readonly notifier: BubbleAlertNotifier
    ) {}

    async execute(now = new Date()): Promise<void> {
        // Quiet hours: 12am-6am Iran time
        const iranHour = new Date(
            now.toLocaleString("en-US", {
                timeZone: "Asia/Tehran"
            })
        ).getHours();

        if (iranHour >= 0 && iranHour < 6) {
            return;
        }

        const alerts = await this.bubbleAlertService.getDueAlerts(now);
        if (!alerts.length) return;

        let price;
        try {
            price = await this.marketPriceProvider.getCurrentPrice();
        } catch (error) {
            console.error("Failed to get price for bubble alert", error);
            return;
        }

        const bubble = this.bubbleCalculator.calculate(price);

        await Promise.all(
            alerts.map(async alert => {
                const alertType = alert.checkBubble(bubble.bubblePercentage);
                if (!alertType) return;

                try {
                    await this.notifier.send(
                        alert.userId,
                        bubble.bubblePercentage,
                        alertType,
                        bubble
                    );
                    await this.bubbleAlertService.markNotified(alert.userId, now);
                } catch (error) {
                    console.error("Bubble alert notify failed", {
                        userId: alert.userId,
                        error
                    });
                }
            })
        );
    }
}
