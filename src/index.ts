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
        const scheduledMinute = new Date(controller.scheduledTime).getUTCMinutes();

        ctx.waitUntil(
            (async () => {
                try {
                    await currentContainer.collectOunceTickJob.execute();
                } catch (error) {
                    console.error("Failed to collect ounce tick:", error);
                }

                try {
                    await currentContainer.sp2lSignalSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to evaluate/publish SP2L signal:", error);
                }

                try {
                    await currentContainer.goldPriceAlertSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to send gold price alerts:", error);
                }

                try {
                    await currentContainer.marketReportSchedulerJob.execute();
                } catch (error) {
                    console.error("Failed to send market reports:", error);
                }

                if (scheduledMinute % 30 !== 0) {
                    return;
                }

                try {
                    await currentContainer.refreshMarketPriceJob.execute();
                } catch (error) {
                    console.error("Failed to refresh market price:", error);
                }
            })()
        );
    }
};
