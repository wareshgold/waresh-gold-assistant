import {
  TelegramCallbackContext,
} from "./TelegramCallbackContext";


import {
  TelegramCallbackHandler,
} from "./TelegramCallbackHandler";





export class TelegramCallbackRouter {



    private readonly handlers:

        TelegramCallbackHandler[];





    constructor(

        handlers:
            TelegramCallbackHandler[]

    ) {

        this.handlers =
            handlers;

    }






    getHandlers():

        TelegramCallbackHandler[] {

        return this.handlers;

    }








    async execute(

        context:
            TelegramCallbackContext

    ):
        Promise<any> {




        const handler =

            this.handlers.find(

                item =>

                    item.canHandle(

                        context

                    )

            );





        if (!handler) {


            return {


                content:

                    "عملیات نامعتبر است"


            };


        }






        return handler.execute(

            context

        );



    }



}