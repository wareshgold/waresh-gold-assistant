import { TelegramCommandContext } from "./TelegramCommandContext";
import { TelegramCommandHandler } from "./TelegramCommandHandler";


export class TelegramCommandRouter {


    private readonly handlers: TelegramCommandHandler[];



    constructor(
        handlers: TelegramCommandHandler[] | TelegramCommandHandler
    ) {

        if (Array.isArray(handlers)) {

            this.handlers = handlers;

        } else {

            this.handlers = [];

        }

    }



    async execute(
        context: TelegramCommandContext
    ): Promise<any> {


        const handler =
            this.handlers.find(
                item =>
                    item.canHandle(
                        context.command
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