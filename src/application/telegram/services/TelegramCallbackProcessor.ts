import {
    TelegramCallbackRouter,
}
from "../callbacks/TelegramCallbackRouter";


import {
    TelegramCallbackMapper,
}
from "../mappers/TelegramCallbackMapper";





export class TelegramCallbackProcessor {




    constructor(


        private readonly mapper:
            TelegramCallbackMapper,



        private readonly router:
            TelegramCallbackRouter


    ) {}








    async process(

        update:
            any

    ): Promise<any> {



        console.log(

            "CALLBACK RAW DATA:",

            update.callback_query?.data

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




        return response;


    }



}