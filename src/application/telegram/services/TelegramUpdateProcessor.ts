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

    ){}



    async process(
        update: any
    ): Promise<void> {



        const mapped =
            this.mapper.map(update);



        const response =
            await this.handler.handle({

                userId:
                    String(mapped.chatId),

                text:
                    mapped.text

            });



        await this.botClient.sendMessage({

            chatId:
                String(mapped.chatId),

            text:
                response

        });


    }


}