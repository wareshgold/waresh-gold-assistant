import {
    TelegramCallbackContext,
}
from "./TelegramCallbackContext";


import {
    TelegramCallbackHandler,
}
from "./TelegramCallbackHandler";


import {
    TelegramCommandResponse,
}
from "../commands/TelegramCommandHandler";







export class TelegramCallbackRouter {





    private readonly handlers:

        TelegramCallbackHandler[];







    constructor(

        handlers:

            TelegramCallbackHandler[]

    ) {


        this.handlers = handlers;


    }









    getHandlers():

        TelegramCallbackHandler[] {


        return [

            ...this.handlers

        ];


    }









    async execute(

        context:

            TelegramCallbackContext

    ):

        Promise<TelegramCommandResponse> {





        const handler =

            this.handlers.find(

                item =>

                    item.canHandle(

                        context

                    )

            );








        if (!handler) {



            console.log(

                "UNKNOWN CALLBACK:",

                context.data,

                context.callback

            );







            return {



                type:

                    "text",



                content:



                    `عملیات نامعتبر است\n\n${context.data}`



            };



        }









        const response =

            await handler.execute(

                context

            );








        if (

            typeof response === "string"

        ) {



            return {



                type:

                    "text",



                content:

                    response



            };


        }








        return response;



    }





}