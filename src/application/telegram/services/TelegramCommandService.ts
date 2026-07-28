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


import { TelegramActionExecutor }
from "../actions/TelegramActionExecutor";



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
            TelegramCommandContextBuilder,


        private readonly actionExecutor?:
            TelegramActionExecutor



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

            normalizedMessage

        );





        const text =

            normalizedMessage.text

                .trim();





        /*
         * Commands همیشه اولویت دارند
         */

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






        /*
         * Menu actions
         */

        if (

            this.actionExecutor

        ) {



            const actionResponse =


                await this.tryExecuteAction(

                    text

                );



            if (

                actionResponse

            ) {

                return actionResponse;

            }


        }







        /*
         * Active conversations
         */

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





        return this.router.execute(

            context

        );


    }








    private async tryExecuteAction(

        text:
            string

    ): Promise<any | undefined> {



        try {


            return await this.actionExecutor!.execute(

                text

            );


        }

        catch {


            return undefined;


        }


    }



}