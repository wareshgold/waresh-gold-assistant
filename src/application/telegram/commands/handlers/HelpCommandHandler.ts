import { TelegramCommandHandler } from "../TelegramCommandHandler";


export class HelpCommandHandler
implements TelegramCommandHandler {


    canHandle(
        command: string
    ): boolean {


        return command === "/help";

    }



    async execute(): Promise<any> {


        return {

            content:
            "دستورات:\n/price"

        };

    }

}