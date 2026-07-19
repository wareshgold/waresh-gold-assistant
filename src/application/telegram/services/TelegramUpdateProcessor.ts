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


        console.log("PROCESS START");


        const mapped =
            this.mapper.map(update);


        console.log(
            "MAPPED",
            mapped
        );



        const response =
            await this.handler.handle({

                userId:
                    String(mapped.chatId),

                text:
                    mapped.text

            });



        console.log(
            "HANDLED",
            response
        );



        console.log(
            "BEFORE SEND"
        );



        await this.botClient.sendMessage({

            chatId:
                String(mapped.chatId),

            text:
                response

        });



        console.log(
            "AFTER SEND"
        );


    }


}