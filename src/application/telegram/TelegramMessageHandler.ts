import { TelegramCommandExecutor }
from "./interfaces/TelegramCommandExecutor";

import { IncomingMessage }
from "../common/models/IncomingMessage";

import { TelegramResponseFormatter }
from "./TelegramResponseFormatter";


export class TelegramMessageHandler {


    constructor(

        private readonly commandService:
            TelegramCommandExecutor,


        private readonly formatter?:
            TelegramResponseFormatter

    ) {}



    async handle(

        message: IncomingMessage

    ): Promise<string> {


        const response =
            await this.commandService.execute(
                message
            );



        console.log(
            "HANDLER RESPONSE:",
            response
        );



        if (!response) {

            return "";

        }



        if (this.formatter) {

            return this.formatter.format(
                response
            );

        }



        if (typeof response === "string") {

            return response;

        }



        return response.content ?? "";

    }


}