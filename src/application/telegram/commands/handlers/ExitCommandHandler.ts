import {
    TelegramCommandHandler
}
from "../TelegramCommandHandler";


import {
    TelegramCommandContext
}
from "../TelegramCommandContext";


import {
    TelegramSessionStore
}
from "../../state/TelegramSessionStore";




export class ExitCommandHandler

implements TelegramCommandHandler {



    constructor(

        private readonly sessionStore:

            TelegramSessionStore

    ) {}




    metadata() {

        return {

            command:

                "/exit",


            description:

                "خروج از گفتگو یا محاسبه‌ی جاری"

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

            normalized === "/exit"
            ||
            normalized === "exit"
            ||
            normalized === "خروج"

        );

    }




    async execute(

        context:

            TelegramCommandContext

    ) {

        const userId =

            context.userId ?? "unknown";


        const session =

            await this.sessionStore.get(

                userId

            );


        if (!session) {

            return {

                type:

                    "text" as const,


                content:

                    "هیچ گفتگو یا محاسبه‌ی فعالی نداری."

            };

        }


        await this.sessionStore.delete(

            userId

        );


        return {

            type:

                "text" as const,


            content:

                "✅ گفتگو پایان یافت. می‌تونی از منوی اصلی ادامه بدی."

        };

    }

}