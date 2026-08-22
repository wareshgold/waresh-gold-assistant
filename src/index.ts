import { createContainer } from "./bootstrap/createContainer";

let container: ReturnType<typeof createContainer> | undefined;

function getContainer(env: Env) {
    if (!container) {
        container = createContainer(env);
    }

    return container;
}

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        return getContainer(env).telegramWebhookController.handle(
            request,
            env,
            ctx
        );
    },

    async scheduled(
        controller: ScheduledController,
        env: Env,
        ctx: ExecutionContext
    ): Promise<void> {
        const currentContainer = getContainer(env);
        const scheduledMinute = new Date(
            controller.scheduledTime
        ).getUTCMinutes();

        ctx.waitUntil(
            (async () => {
                try {
                    await currentContainer.collectOunceTickJob.execute();
                } catch (error) {
                    console.error(
                        "Failed to collect ounce tick:",
                        error
                    );
                }

                if (scheduledMinute % 30 !== 0) {
                    return;
                }

                try {
                    await currentContainer.refreshMarketPriceJob.execute();
                } catch (error) {
                    console.error(
                        "Failed to refresh market price:",
                        error
                    );
                }
            })()
        );
    }
};