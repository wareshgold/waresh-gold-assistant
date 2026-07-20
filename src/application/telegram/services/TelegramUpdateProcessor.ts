import { TelegramUpdateMapper } from "../../../infrastructure/telegram/TelegramUpdateMapper";
import { TelegramMessageHandler } from "../TelegramMessageHandler";
import { TelegramResponseFormatter } from "../TelegramResponseFormatter";
import { TelegramBotClient } from "../../../infrastructure/telegram/TelegramBotClient";
import { TelegramUpdate } from "../../../infrastructure/telegram/models/TelegramUpdate";


export class TelegramUpdateProcessor {


    constructor(

        private readonly mapper:
            TelegramUpdateMapper,


        private readonly handler:
            TelegramMessageHandler,


        private readonly formatter:
            TelegramResponseFormatter,


        private readonly botClient:
            TelegramBotClient

    ) {}



    async process(

        update: TelegramUpdate

    ): Promise<void> {


        const message =
            this.mapper.map(update);



        const response =
            await this.handler.handle({

                userId:
                    String(message.chatId),


                text:
                    message.text

            });



        await this.botClient.sendMessage({

            chatId:
                String(message.chatId),


            text:
                response

        });


    }


}