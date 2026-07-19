import { TelegramBotClient } from "./TelegramBotClient";
import { TelegramOutgoingMessage } from "./models/TelegramOutgoingMessage";


export class FakeTelegramBotClient
implements TelegramBotClient {


    public messages:
        TelegramOutgoingMessage[] = [];



    async sendMessage(
        message: TelegramOutgoingMessage
    ): Promise<void> {


        this.messages.push(
            message
        );


    }



    getLastMessage(){

        return this.messages[
            this.messages.length - 1
        ];

    }


}