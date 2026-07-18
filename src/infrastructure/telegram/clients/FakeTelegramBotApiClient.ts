import { TelegramBotApiClient } from "./TelegramBotApiClient";


export class FakeTelegramBotApiClient
implements TelegramBotApiClient {


    public messages:{
        chatId:string;
        text:string;
    }[]=[];


    async sendMessage(
        chatId:string,
        text:string
    ):Promise<void>{

        this.messages.push({
            chatId,
            text
        });

    }

}