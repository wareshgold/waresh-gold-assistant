import { TelegramCommandContext }
from "../TelegramCommandContext";

import {
    TelegramCommandHandler
}
from "../TelegramCommandHandler";



export class HelpCommandHandler
implements TelegramCommandHandler {



    constructor(

        private readonly handlerProvider:
            () => TelegramCommandHandler[]

    ) {}



    metadata() {

        return {

            command:
                "/help",

            description:
                "راهنمای دستورات ربات"

        };

    }



    canHandle(

        command: string

    ): boolean {


        const normalizedCommand =
            command.trim()
                .toLowerCase();



        return (

            normalizedCommand === "/help" ||

            normalizedCommand === "help"

        );

    }





    async execute(

        context: TelegramCommandContext

    ) {


        const commands =

            this.handlerProvider()

                .map(

                    handler => {


                        const metadata =

                            handler.metadata?.();



                        if (!metadata) {

                            return "";

                        }



                        return (

                            `${metadata.command}\n` +

                            `${metadata.description}`

                        );


                    }

                )

                .filter(Boolean);





        return {

            type: "text" as const,

            content:

                [

                    "🟡 وارش گلد",

                    "",

                    "🤖 ربات هوشمند طلا",

                    "",

                    "دستورات موجود:",

                    "",

                    ...commands

                ]

                .join("\n\n")

        };


    }


}