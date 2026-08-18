import {
    TelegramCommandContext
}
from "./TelegramCommandContext";


import {
    TelegramCommandHandler
}
from "./TelegramCommandHandler";


import {
    TelegramExecutorResponse
}
from "../interfaces/TelegramCommandExecutor";



export class TelegramCommandRouter {



    private readonly handlers:

        TelegramCommandHandler[];





    constructor(

        handlers:

            TelegramCommandHandler[]

    ) {


        this.handlers = handlers;


    }







    getHandlers():

        TelegramCommandHandler[] {


        return this.handlers;


    }







    async execute(

        context:

            TelegramCommandContext

    ):
        Promise<TelegramExecutorResponse> {




        const command =

            context.command

                .trim()

                .toLowerCase();







        const handler =

            this.handlers.find(

                item =>

                    item.canHandle(

                        command

                    )

            );







        if (!handler) {


            return {


                type:

                    "text",


                content:

                    "دستور نامعتبر است"


            };


        }







        return handler.execute(

            context

        );


    }



}