import { TelegramCommandExecutor }
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

    ): Promise<any> {



        const normalizedMessage:

            IncomingMessage =


            typeof message === "string"

                ? {

                    userId:
                        "default",

                    text:
                        message

                }

                : message;





        console.log(

            "INCOMING MESSAGE:",

            {

                userId:
                    normalizedMessage.userId,


                username:
                    normalizedMessage.username,


                firstName:
                    normalizedMessage.firstName,


                text:
                    normalizedMessage.text

            }

        );






        if (

            this.conversationManager

        ) {



            const activeConversation =


                await this.conversationManager.execute(

                    normalizedMessage.userId,

                    normalizedMessage.text

                );





            if (

                activeConversation

            ) {


                return activeConversation;


            }


        }







        const context =


            this.contextBuilder.build(

                normalizedMessage.text,

                normalizedMessage.userId,

                [],

                normalizedMessage.username,

                normalizedMessage.firstName

            );







        console.log(

            "COMMAND CONTEXT:",

            context

        );







        return this.router.execute(

            context

        );



    }


}