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
        const m = new Date(controller.scheduledTime).getUTCMinutes();

        ctx.waitUntil(
            (async () => {
                // Every minute: collect price tick (lightweight, critical)
                try {
                    await currentContainer.collectOunceTickJob.execute();
                } catch (error) {
                    console.error("Failed to collect ounce tick:", error);
                }

                // Every 5 minutes: Strategy A signal evaluation
                if (m % 5 === 0) {
                    try {
                        await currentContainer.strategyASignalSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to evaluate Strategy A signal:", error);
                    }
                }

                // Every 5 minutes: gold price alerts (user-configured intervals are 1h+)
                if (m % 5 === 0) {
                    try {
                        await currentContainer.goldPriceAlertSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to send gold price alerts:", error);
                    }
                }

                // Every 10 minutes: market reports (user intervals are 6h+)
                if (m % 10 === 0) {
                    try {
                        await currentContainer.marketReportSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to send market reports:", error);
                    }
                }

                // Every 5 minutes: signal level monitoring
                if (m % 5 === 0) {
                    try {
                        await currentContainer.signalMonitorJob.execute();
                    } catch (error) {
                        console.error("Failed to monitor signal levels:", error);
                    }
                }

                // Every 10 minutes: bubble alerts (threshold-based, not time-critical)
                if (m % 10 === 0) {
                    try {
                        await currentContainer.bubbleAlertSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to send bubble alerts:", error);
                    }
                }

                // Every 5 minutes: price target alerts
                if (m % 5 === 0) {
                    try {
                        await currentContainer.priceTargetAlertSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to check price target alerts:", error);
                    }
                }

                // Every 30 minutes: refresh market price cache
                if (m % 30 === 0) {
                    try {
                        await currentContainer.refreshMarketPriceJob.execute();
                    } catch (error) {
                        console.error("Failed to refresh market price:", error);
                    }
                }
            })()
        );
    }
};
