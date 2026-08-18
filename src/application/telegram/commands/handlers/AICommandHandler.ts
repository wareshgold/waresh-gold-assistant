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




export class AICommandHandler

implements TelegramCommandHandler {



    constructor(

        private readonly aiService:

            AIService

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



        const question =

            context.arguments.join(" ").trim();






        if (!question) {


            return {


                type:

                    "text" as const,



                content:

`
🤖 دستیار هوشمند وارش گلد

سوال خود را بعد از دستور /ai وارد کنید.

مثال:

/ai قیمت طلا چطور محاسبه می‌شود؟
`

            };


        }






        console.log(

            "AI_PROCESS_START",

            {

                question,

                userId:

                    context.userId

            }

        );








        const result =

            await this.aiService.process({



                message:

                    question,



                userId:

                    context.userId ?? "unknown",



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