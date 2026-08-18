import {
    TelegramCommandExecutor,
    TelegramExecutorResponse
}
from "../interfaces/TelegramCommandExecutor";


import { TelegramCommandRouter }
from "../commands/TelegramCommandRouter";


import { TelegramCommandContextBuilder }
from "../commands/TelegramCommandContextBuilder";


import { IncomingMessage }
from "../../common/models/IncomingMessage";


import { TelegramConversationManager }
from "../flows/TelegramConversationManager";



export class TelegramCommandService

implements TelegramCommandExecutor {



    private readonly contextBuilder:

        TelegramCommandContextBuilder;



    constructor(


        private readonly router:

            TelegramCommandRouter,


        private readonly conversationManager?:

            TelegramConversationManager,


        contextBuilder?:

            TelegramCommandContextBuilder



    ) {


        this.contextBuilder =

            contextBuilder ??

            new TelegramCommandContextBuilder();


    }







    async execute(

        message:
            IncomingMessage | string

    ):
        Promise<TelegramExecutorResponse> {



        const normalizedMessage:

            IncomingMessage =



            typeof message === "string"

                ? {

                    userId:

                        "default",


                    text:

                        message

                }

                :

                message;







        console.log(

            "INCOMING MESSAGE:",

            normalizedMessage

        );







        const text =

            normalizedMessage.text

                .trim();







        if (

            text.startsWith("/")

        ) {



            const context =

                this.contextBuilder.build(

                    text,

                    normalizedMessage.userId,

                    [],

                    normalizedMessage.username,

                    normalizedMessage.firstName

                );





            return this.router.execute(

                context

            );


        }








        if (

            this.conversationManager

        ) {



            const activeConversation =

                await this.conversationManager.execute(

                    normalizedMessage.userId,

                    text

                );





            if (

                activeConversation

            ) {


                return activeConversation;


            }


        }








        const context =

            this.contextBuilder.build(

                text,

                normalizedMessage.userId,

                [],

                normalizedMessage.username,

                normalizedMessage.firstName

            );







        const commandExists =

            this.router

                .getHandlers()

                .some(

                    handler =>

                        handler.canHandle(

                            context.command

                                .trim()

                                .toLowerCase()

                        )

                );







        if (

            commandExists

        ) {


            return this.router.execute(

                context

            );


        }








        return this.router.execute(

            context

        );


    }



}