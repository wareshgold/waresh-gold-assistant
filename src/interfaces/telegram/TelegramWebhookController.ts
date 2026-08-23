import { Context } from "hono";

import { TelegramUpdateProcessor } from "../../application/telegram/services/TelegramUpdateProcessor";
import { TelegramWebhookSecurityGuard } from "./TelegramWebhookSecurityGuard";
import { TelegramWebhookAbuseGuard } from "../../infrastructure/telegram/security/TelegramWebhookAbuseGuard";

export class TelegramWebhookController {
    constructor(
        private readonly processor: TelegramUpdateProcessor,
        private readonly securityGuard: TelegramWebhookSecurityGuard,
        private readonly abuseGuard: TelegramWebhookAbuseGuard
    ) {}

    async handle(
        c: Context
    ) {
        const isValid =
            this.securityGuard.validate(c);

        if (!isValid) {
            return c.json(
                {
                    ok: false,
                    error: "Unauthorized"
                },
                401
            );
        }

        try {
            const update =
                await c.req.json();

            const abuseDecision =
                await this.abuseGuard.check(update);

            if (!abuseDecision.allowed) {
                if (
                    abuseDecision.reason ===
                    "duplicate_update"
                ) {
                    console.warn(
                        "TELEGRAM DUPLICATE UPDATE IGNORED",
                        {
                            updateId:
                                update?.update_id
                        }
                    );

                    return c.json({
                        ok: true,
                        duplicate: true
                    });
                }

                console.warn(
                    "TELEGRAM RATE LIMIT EXCEEDED",
                    {
                        userId:
                            update?.message?.from?.id ??
                            update?.callback_query?.from?.id,
                        retryAfterSeconds:
                            abuseDecision.retryAfterSeconds
                    }
                );

                c.header(
                    "Retry-After",
                    String(
                        abuseDecision.retryAfterSeconds
                    )
                );

                return c.json(
                    {
                        ok: false,
                        error: "rate_limited",
                        retryAfterSeconds:
                            abuseDecision.retryAfterSeconds
                    },
                    429
                );
            }

            console.log(
                "TELEGRAM UPDATE RECEIVED:",
                JSON.stringify(update)
            );

            await this.processor.process(
                update
            );

            if (
                typeof update?.update_id ===
                "number"
            ) {
                await this.abuseGuard.markProcessed(
                    update.update_id
                );
            }

            console.log(
                "TELEGRAM UPDATE PROCESSED SUCCESSFULLY"
            );
        }
        catch (error) {
            console.error(
                "Telegram webhook processing failed:",
                error instanceof Error
                    ? error.stack
                    : error
            );

            return c.json(
                {
                    ok: false,
                    error: "processing_failed"
                },
                500
            );
        }

        return c.json({
            ok: true
        });
    }
}
