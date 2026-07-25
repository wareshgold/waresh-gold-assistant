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



        const context =

            this.mapper.map(

                update

            );





        return this.router.execute(

            context

        );


    }



}