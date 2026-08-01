import { TelegramCommandContext } from "./TelegramCommandContext";
import { TelegramCommandHandler } from "./TelegramCommandHandler";


export class TelegramCommandRouter {


    private readonly handlers:
        TelegramCommandHandler[];



    constructor(
        handlers: TelegramCommandHandler[]
    ) {

        this.handlers = handlers;

    }



    getHandlers():

        TelegramCommandHandler[] {

        return this.handlers;

    }



    async execute(

        context: TelegramCommandContext

    ): Promise<any> {


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

                content:
                    "دستور نامعتبر است"

            };

        }



        return handler.execute(

            context

        );


    }


}