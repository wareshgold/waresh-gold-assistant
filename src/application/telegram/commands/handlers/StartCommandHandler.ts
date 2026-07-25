import { TelegramCommandHandler }
from "../TelegramCommandHandler";


import { TelegramCommandContext }
from "../TelegramCommandContext";


import { WelcomeMessageProvider }
from "../../welcome/WelcomeMessageProvider";



export class StartCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly welcomeMessageProvider:
            WelcomeMessageProvider

    ) {}



    metadata() {

        return {

            command:
                "/start",

            description:
                "شروع کار با ربات"

        };

    }



    canHandle(

        command: string

    ): boolean {


        return command === "/start";


    }





    async execute(

        context: TelegramCommandContext

    ): Promise<any> {



        return {


            content:

                this.welcomeMessageProvider.getWelcomeMessage(

                    context.firstName,

                    context.username

                )


        };


    }


}