import { TelegramCommandHandler } from "../TelegramCommandHandler";


export class StartCommandHandler
implements TelegramCommandHandler {


    canHandle(
        command: string
    ): boolean {


        return command === "/start";

    }



    async execute(): Promise<any> {


        return {

            content:
            "سلام به وارش گلد خوش آمدید"

        };

    }

}