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



        if (this.formatter) {

            return this.formatter.format(
                response
            );

        }



        return response.content;

    }


}