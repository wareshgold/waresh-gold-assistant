import { TelegramBotClient } from "./TelegramBotClient";


export class FakeTelegramBotClient
implements TelegramBotClient {


    public messages: {
        chatId: string;
        text: string;
    }[] = [];



    async sendMessage(

        chatId: string,

        text: string

    ): Promise<void> {


        this.messages.push({

            chatId,

            text

        });


    }



    getLastMessage(){

        return this.messages[
            this.messages.length - 1
        ];

    }


}