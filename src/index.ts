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

        const utcMinute = now.getUTCMinutes();

        ctx.waitUntil(
            (async () => {
                // Every minute: collect price tick (lightweight, critical)
                try {
                    await currentContainer.collectOunceTickJob.execute();
                } catch (error) {
                    console.error("Failed to collect ounce tick:", error);
                }

                // Spread heavier jobs across different ticks to stay under CPU limit
                // Strategy A: every 5 min, staggered at m%5==1
                if (utcMinute % 5 === 1) {
                    try {
                        await currentContainer.strategyASignalSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to evaluate Strategy A signal:", error);
                    }
                }

                // Gold price alerts: every 5 min, staggered at m%5==2
                if (utcMinute % 5 === 2) {
                    try {
                        await currentContainer.goldPriceAlertSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to send gold price alerts:", error);
                    }
                }

                // Signal level monitoring: every 5 min, staggered at m%5==3
                if (utcMinute % 5 === 3) {
                    try {
                        await currentContainer.signalMonitorJob.execute();
                    } catch (error) {
                        console.error("Failed to monitor signal levels:", error);
                    }
                }

                // Price target alerts: every 5 min, staggered at m%5==4
                if (utcMinute % 5 === 4) {
                    try {
                        await currentContainer.priceTargetAlertSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to check price target alerts:", error);
                    }
                }

                // Market reports: every 10 min, staggered at m%10==5
                if (utcMinute % 10 === 5) {
                    try {
                        await currentContainer.marketReportSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to send market reports:", error);
                    }
                }

                // Bubble alerts: every 10 min, staggered at m%10==8
                if (utcMinute % 10 === 8) {
                    try {
                        await currentContainer.bubbleAlertSchedulerJob.execute();
                    } catch (error) {
                        console.error("Failed to send bubble alerts:", error);
                    }
                }

                // Refresh market price cache: every 30 min, staggered at m%30==15
                if (utcMinute % 30 === 15) {
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
