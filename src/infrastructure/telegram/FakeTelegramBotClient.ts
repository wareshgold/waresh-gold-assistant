import { TelegramBotClient } from "./TelegramBotClient";
import { TelegramOutgoingMessage } from "./models/TelegramOutgoingMessage";


export class FakeTelegramBotClient
implements TelegramBotClient {


    async sendMessage(
        message: TelegramOutgoingMessage
    ): Promise<void> {


        console.log(
            "FAKE TELEGRAM SEND START",
            message
        );


        return Promise.resolve();


    }


}