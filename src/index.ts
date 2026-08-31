import { createApp } from "./bootstrap/createApp";
import { createContainer } from "./bootstrap/createContainer";
import { AppEnv } from "./shared/config/env";

let cachedContainer: ReturnType<typeof createContainer> | null = null;
let commandsRegistered = false;

function getContainer(env: AppEnv) {
    if (!cachedContainer) {
        cachedContainer = createContainer(env);
    }
    return cachedContainer;
}

export default {
    async fetch(
        request: Request,
        env: AppEnv,
        ctx: ExecutionContext
    ) {
        const container = getContainer(env);

        if (!commandsRegistered && container.commandMenuService) {
            await container.commandMenuService.registerCommands();
            commandsRegistered = true;
        }

        const app = createApp(container);
        return app.fetch(request, env, ctx);
    },

    async scheduled(
        controller: ScheduledController,
        env: AppEnv,
        ctx: ExecutionContext
    ): Promise<void> {
        const currentContainer = getContainer(env);
        const now = new Date(controller.scheduledTime);
        const m = now.getUTCHours() * 60 + now.getUTCMinutes();

        // Market hours: 8 AM to 9 PM Tehran time (UTC+3:30)
        // 8:00 Tehran = 270 UTC minutes (4:30)
        // 21:00 Tehran = 1050 UTC minutes (17:30)
        const TEHRAN_OFFSET = 3 * 60 + 30;
        const tehranMinutes = m + TEHRAN_OFFSET;
        const tehranHour = Math.floor(tehranMinutes / 60) % 24;
        const isInMarketHours = tehranHour >= 8 && tehranHour < 21;

        if (!isInMarketHours) {
            return;
        }

        ctx.waitUntil(
            (async () => {
                // 1. Collect latest price from source channel
                try {
                    await currentContainer.collectOunceTickJob.execute();
                } catch (error) {
                    console.error("Failed to collect ounce tick:", error);
                }

                // 2. Refresh cached market price
                try {
                    await currentContainer.refreshMarketPriceJob.execute();
                } catch (error) {
                    console.error("Failed to refresh market price:", error);
                }

                // 3. Send user-configured gold price alerts
                try {
                    await currentContainer.goldPriceAlertSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to send gold price alerts:", error);
                }

                // 4. Send market reports
                try {
                    await currentContainer.marketReportSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to send market reports:", error);
                }

                // 5. Check bubble alerts
                try {
                    await currentContainer.bubbleAlertSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to send bubble alerts:", error);
                }

                // 6. Check price target alerts
                try {
                    await currentContainer.priceTargetAlertSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to check price target alerts:", error);
                }

                // 7. Strategy A signal evaluation
                try {
                    await currentContainer.strategyASignalSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to evaluate Strategy A signal:", error);
                }

                // 8. Signal level monitoring
                try {
                    await currentContainer.signalMonitorJob.execute();
                } catch (error) {
                    console.error("Failed to monitor signal levels:", error);
                }
            })()
        );
    }
};
