import {
    TelegramCallbackRouter,
}
from "../callbacks/TelegramCallbackRouter";


import {
    TelegramCallbackMapper,
}
from "../mappers/TelegramCallbackMapper";


import {
    TelegramCommandResponse,
}
from "../commands/TelegramCommandHandler";







export class TelegramCallbackProcessor {





    constructor(



        private readonly mapper:

            TelegramCallbackMapper,



        private readonly router:

            TelegramCallbackRouter



    ) {}









    async process(

        update:

            unknown

    ):

        Promise<TelegramCommandResponse> {





        const telegramUpdate =

            update as Record<string, unknown>;







        const callbackQuery =

            telegramUpdate[

                "callback_query"

            ] as Record<string, unknown> | undefined;







        console.log(

            "CALLBACK RAW DATA:",

            callbackQuery?.["data"]

        );









        const context =

            this.mapper.map(

                update

            );









        console.log(

            "CALLBACK CONTEXT:",

            JSON.stringify(

                context,

                null,

                2

            )

        );









        const response =

            await this.router.execute(

                context

            );









        console.log(

            "CALLBACK RESPONSE:",

            JSON.stringify(

                response,

                null,

                2

            )

        );








        return response as TelegramCommandResponse;



    }



}