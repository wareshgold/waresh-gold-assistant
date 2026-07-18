import { TelegramUpdateProcessor } from "../../application/telegram/services/TelegramUpdateProcessor";


export class TelegramWebhookController {


    constructor(
        private readonly processor: TelegramUpdateProcessor
    ){}



    async handle(
        request: Request
    ): Promise<Response> {


        const update =
            await request.json();



        await this.processor.process(
            update
        );



        return new Response(

            JSON.stringify({

                ok: true

            }),

            {
                status: 200,
                headers:{
                    "content-type":"application/json"
                }
            }

        );

    }


}