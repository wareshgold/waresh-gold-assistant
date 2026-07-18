import { TelegramCommandExecutor } from "./services/TelegramCommandService";
import { TelegramResponseFormatter } from "./TelegramResponseFormatter";
import { IncomingMessage } from "../common/models/IncomingMessage";


export class TelegramMessageHandler {


    constructor(
        private readonly commandService: TelegramCommandExecutor,
        private readonly formatter: TelegramResponseFormatter
    ) {}



    async handle(
        message: IncomingMessage
    ): Promise<string> {


        const response =
            await this.commandService.execute(
                message.text
            );


        return this.formatter.format(
            response
        );

    }

}