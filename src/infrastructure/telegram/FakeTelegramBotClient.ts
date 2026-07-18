import { TelegramBotClient } from "./TelegramBotClient";


export class FakeTelegramBotClient
implements TelegramBotClient {


    async sendMessage(
        chatId: string,
        message: string
    ): Promise<void> {


        console.log(
            "Fake Telegram Message",
            {
                chatId,
                message
            }
        );

    }

}