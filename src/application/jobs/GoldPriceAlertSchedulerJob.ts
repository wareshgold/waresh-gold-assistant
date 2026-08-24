import {
    GoldPriceAlertService
} from "../gold-alert/GoldPriceAlertService";

import {
    MarketPriceProvider
} from "../../domain/market/providers/MarketPriceProvider";

export interface GoldPriceAlertNotifier {
    send(
        userId: string,
        gold18Price: number,
        currencyPrice: number,
        ouncePrice: number | null,
        updatedAt: Date
    ): Promise<void>;
}

export class GoldPriceAlertSchedulerJob {
    constructor(
        private readonly alertService: GoldPriceAlertService,
        private readonly marketPriceProvider: MarketPriceProvider,
        private readonly notifier: GoldPriceAlertNotifier
    ) {}

    async execute(now = new Date()): Promise<void> {
        // Quiet hours: 12am-6am Iran time (no price alerts)
        const iranHour = new Date(
            now.toLocaleString("en-US", {
                timeZone: "Asia/Tehran"
            })
        ).getHours();

        if (iranHour >= 0 && iranHour < 6) {
            return;
        }

        const alerts = await this.alertService
            .getDueAlerts(now);

        if (!alerts.length) return;

        const price = await this.marketPriceProvider.getCurrentPrice();

        await Promise.all(
            alerts.map(async alert => {
                const claimed = await this.alertService.claimDue(
                    alert,
                    now
                );

                if (!claimed) return;

                try {
                    await this.notifier.send(
                        alert.userId,
                        price.gold18Price,
                        price.currencyPrice,
                        price.ouncePrice,
                        price.updatedAt
                    );

                    await this.alertService.markNotified(
                        alert.userId,
                        now
                    );
                } catch (error) {
                    await this.alertService.releaseClaim(
                        alert.userId
                    );
                    throw error;
                }
            })
        );
    }
}
