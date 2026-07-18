import { Context } from "hono";
import { TelegramUpdateProcessor } from "../../application/telegram/services/TelegramUpdateProcessor";


export class TelegramWebhookController {

    constructor(
        private readonly processor: TelegramUpdateProcessor
    ) {}


    async handle(
        c: Context
    ) {

        try {

            const update =
                await c.req.json();


            await this.processor.process(
                update
            );


            return c.json({
                ok: true
            });


        } catch (error) {

            console.error(
                "Telegram webhook error",
                error
            );


            return c.json(
                {
                    ok: false,
                    error: "Webhook processing failed"
                },
                500
            );

        }

    }

}