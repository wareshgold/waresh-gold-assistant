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