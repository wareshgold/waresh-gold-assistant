import {
    ApplicationResponse
}
from "../common/models/ApplicationResponse";


import {
    ActionHandler,
    ActionExecutionContext
}
from "./ActionHandler";


import {
    TelegramCommandRouter
}
from "../telegram/commands/TelegramCommandRouter";


import {
    TelegramCommandContextBuilder
}
from "../telegram/commands/TelegramCommandContextBuilder";





export class TelegramCommandActionHandlerAdapter

implements ActionHandler {





    constructor(


        private readonly command:

            string,


        private readonly router:

            TelegramCommandRouter,


        private readonly contextBuilder:

            TelegramCommandContextBuilder =

                new TelegramCommandContextBuilder()


    ) {}








    async execute(

        context:

            ActionExecutionContext

    ):

        Promise<ApplicationResponse> {





        const telegramContext =


            this.contextBuilder.build(



                this.command,



                context.userId ?? "default",



                [],



                context.username,



                context.firstName



            );








        const response =


            await this.router.execute(

                telegramContext

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








        return {


            type:

                response.type === "data"

                    ? "data"

                    : "text",



            content:

                response.content ?? "",



            data:

                response.data,



            metadata:

                response.metadata


        };



    }



}