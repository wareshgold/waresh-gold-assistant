import {
    TelegramBotClient
} from "./TelegramBotClient";


export class TelegramApiClient
implements TelegramBotClient {


    constructor(
        private readonly botToken: string
    ){}



    async sendMessage(
        chatId: string,
        message: string
    ): Promise<void> {


        const url =
            `https://api.telegram.org/bot${this.botToken}/sendMessage`;



        await fetch(
            url,
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            }
        );

    }

}