import { Context } from "hono";


export class TelegramWebhookSecurityGuard {


    constructor(
        private readonly secret?: string
    ){}



    validate(
        c: Context
    ): boolean {


        const expectedSecret =
            this.secret ??
            "development-secret";



        const headerSecret =
            c.req.header(
                "X-Telegram-Bot-Api-Secret-Token"
            );



        return (
            headerSecret === expectedSecret
        );

    }

}