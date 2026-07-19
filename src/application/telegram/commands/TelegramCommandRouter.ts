import { TelegramCommandHandler } from "./TelegramCommandHandler";


export class TelegramCommandRouter {


    constructor(
        private readonly handlers: TelegramCommandHandler[]
    ) {}



    async execute(
        command: string
    ): Promise<any> {


        const normalizedCommand =
            command.trim();



        const handler =
            this.handlers.find(
                item =>
                    item.canHandle(
                        normalizedCommand
                    )
            );



        if (!handler) {

            return {

                content:
                "دستور نامعتبر است"

            };

        }



        return handler.execute(
            normalizedCommand
        );

    }

}