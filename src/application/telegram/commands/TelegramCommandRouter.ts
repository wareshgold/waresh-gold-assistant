import { TelegramCommandContext } from "./TelegramCommandContext";
import { TelegramCommandHandler } from "./TelegramCommandHandler";


export class TelegramCommandRouter {


    constructor(
        private readonly handlers: TelegramCommandHandler[]
    ) {}



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



        if(!handler){

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