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







        try {


            const update =

                await c.req.json();





            console.log(

                "TELEGRAM UPDATE RECEIVED:",

                JSON.stringify(update)

            );





            await this.processor.process(

                update

            );





            console.log(

                "TELEGRAM UPDATE PROCESSED SUCCESSFULLY"

            );



        }

        catch(error){



            console.error(

                "Telegram webhook processing failed:",

                error instanceof Error

                    ? error.stack

                    : error

            );





            return c.json(

                {

                    ok:false,

                    error:

                        "processing_failed"

                },

                500

            );


        }







        return c.json({

            ok:true

        });


    }


}