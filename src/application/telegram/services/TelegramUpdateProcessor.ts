import { TelegramUpdateMapper } from "../../../infrastructure/telegram/TelegramUpdateMapper";
import { TelegramMessageHandler } from "../TelegramMessageHandler";
import { TelegramResponseFormatter } from "../TelegramResponseFormatter";
import { TelegramBotClient } from "../../../infrastructure/telegram/TelegramBotClient";


export class TelegramUpdateProcessor {


    constructor(

        private readonly mapper: TelegramUpdateMapper,

        private readonly handler: TelegramMessageHandler,

        private readonly formatter: TelegramResponseFormatter,

        private readonly botClient: TelegramBotClient

    ) {}



    async process(
        update: unknown
    ): Promise<void> {


        const message =
            this.mapper.map(update);



        if (!message) {

            return;

        }



        const response =
            await this.handler.handle(
                message
            );



        const formattedResponse =
            this.formatter.format({
                content: response
            });



        await this.botClient.sendMessage({

            chatId: String(message.chatId),

            text: formattedResponse

        });


    }


}