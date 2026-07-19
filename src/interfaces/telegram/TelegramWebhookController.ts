import { Context } from "hono";
import { TelegramUpdateProcessor } from "../../application/telegram/services/TelegramUpdateProcessor";
import { TelegramWebhookSecurityGuard } from "./TelegramWebhookSecurityGuard";


export class TelegramWebhookController {


    constructor(
        private readonly processor: TelegramUpdateProcessor,
        private readonly securityGuard: TelegramWebhookSecurityGuard
    ){}



    async handle(
        c: Context
    ) {


        const isValid =
            this.securityGuard.validate(c);



        if(!isValid){

            return c.json(
                {
                    ok:false,
                    error:"Unauthorized"
                },
                401
            );

        }



        const update =
            await c.req.json();



        await this.processor.process(
            update
        );



        return c.json({
            ok:true
        });

    }

}