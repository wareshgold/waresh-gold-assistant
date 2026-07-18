import { TelegramBotClient } from "./TelegramBotClient";
import { TelegramOutgoingMessage } from "./models/TelegramOutgoingMessage";


export class FakeTelegramBotClient
implements TelegramBotClient {


    async sendMessage(
        message: TelegramOutgoingMessage
    ): Promise<void> {


        console.log(
            "Fake Telegram Message",
            message
        );


    }


}