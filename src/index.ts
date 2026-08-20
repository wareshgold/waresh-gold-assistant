import { createContainer } from "./bootstrap/createContainer";

const container = createContainer();

export default {
    async fetch(
        request: Request,
        env: Env,
        ctx: ExecutionContext
    ): Promise<Response> {
        return container.telegramWebhookController.handle(
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
        ctx.waitUntil(
            (async () => {
                try {
                    await container.collectOunceTickJob.execute();
                } catch (error) {
                    console.error(
                        "Failed to collect ounce tick:",
                        error
                    );
                }

                try {
                    await container.refreshMarketPriceJob.execute();
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
