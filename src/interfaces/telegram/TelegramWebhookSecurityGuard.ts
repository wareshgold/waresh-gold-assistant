import { Context } from "hono";


export class TelegramWebhookSecurityGuard {


    constructor(
        private readonly secret: string
    ){}



    validate(
        c: Context
    ): boolean {


        if(!this.secret){

            return false;

        }



        const headerSecret =
            c.req.header(
                "X-Telegram-Bot-Api-Secret-Token"
            );



        return (
            headerSecret === this.secret
        );

    }

}