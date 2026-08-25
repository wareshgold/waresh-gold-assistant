import { PriceTargetAlertService } from "../price-target-alert/PriceTargetAlertService";
import { GetCurrentGoldPriceUseCase } from "../gold/GetCurrentGoldPriceUseCase";

export interface PriceTargetAlertNotifier {
    send(
        userId: string,
        targetPrice: number,
        direction: "ABOVE" | "BELOW",
        currentPrice: number
    ): Promise<void>;
}

export class PriceTargetAlertSchedulerJob {
    constructor(
        private readonly alertService: PriceTargetAlertService,
        private readonly getGoldPriceUseCase: GetCurrentGoldPriceUseCase,
        private readonly notifier: PriceTargetAlertNotifier
    ) {}

    async execute(): Promise<void> {
        try {
            const priceResult = await this.getGoldPriceUseCase.execute();

            if (!priceResult?.price || priceResult.price <= 0) {
                return;
            }

            const currentPrice = priceResult.price;
            const triggered = await this.alertService.checkAndNotify(currentPrice);

            for (const { alert, userId } of triggered) {
                await this.notifier.send(
                    userId,
                    alert.targetPrice,
                    alert.direction,
                    currentPrice
                );
            }

            if (triggered.length > 0) {
                console.log("PRICE_TARGET_ALERTS_TRIGGERED", {
                    count: triggered.length,
                    currentPrice
                });
            }
        } catch (error) {
            console.error("PriceTargetAlertSchedulerJob failed", { error });
        }
    }
}
