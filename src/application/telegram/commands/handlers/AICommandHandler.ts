import {
    TelegramCommandHandler
}
from "../TelegramCommandHandler";


import {
    TelegramCommandContext
}
from "../TelegramCommandContext";


import {
    AIService
}
from "../../../ai/services/AIService";


import {
    TelegramSessionStore
}
from "../../state/TelegramSessionStore";


import {
    AI_CHAT_STATE
}
from "../../flows/AIConversationFlow";




export class AICommandHandler

implements TelegramCommandHandler {



    constructor(

        private readonly aiService:

            AIService,

        private readonly sessionStore?:

            TelegramSessionStore

    ) {}




    metadata() {

        return {

            command:

                "/ai",


            description:

                "دستیار هوشمند وارش گلد"

        };

    }




    canHandle(

        command:

            string

    ):

        boolean {

        const normalized =

            command
                .trim()
                .toLowerCase();


        return (

            normalized === "/ai"
            ||
            normalized === "ai"

        );

    }




    async execute(

        context:

            TelegramCommandContext

    ) {

        const userId =

            context.userId ?? "unknown";



        if (this.sessionStore) {

            await this.sessionStore.save({

                userId,

                state:

                    AI_CHAT_STATE,

                data:

                    {},

                updatedAt:

                    Date.now()

            });

        }



        const question =

            context.arguments.join(" ").trim();



        if (!question) {

            return {

                type:

                    "text" as const,


                content:

`
🤖 دستیار هوشمند وارش گلد

گفتگو شروع شد. هر سوالی داری بپرس، دیگه لازم نیست /ai بذاری اول پیامت.

برای پایان گفتگو /exit رو بفرست.
`

            };

        }



        console.log(

            "AI_PROCESS_START",

            {

                question,

                userId

            }

        );



        const result =

            await this.aiService.process({

                message:

                    question,

                userId,

                context:

                {

                    telegramUsername:

                        context.username,

                    firstName:

                        context.firstName

                }

            });



        console.log(

            "AI_PROCESS_RESULT",

            result

        );



        return {

            type:

                "text" as const,


            content:

                result.content

        };

    }

}