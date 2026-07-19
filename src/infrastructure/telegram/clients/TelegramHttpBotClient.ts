import { TelegramBotClient } from "../TelegramBotClient";
import { TelegramOutgoingMessage } from "../models/TelegramOutgoingMessage";


export class TelegramHttpBotClient
implements TelegramBotClient {


    constructor(
        private readonly botToken: string
    ){}



    async sendMessage(
        message: TelegramOutgoingMessage
    ): Promise<void> {


        const response =
            await fetch(
                `https://api.telegram.org/bot${this.botToken}/sendMessage`,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },


                    body:
                        JSON.stringify({

                            chat_id:
                                message.chatId,


                            text:
                                message.text

                        })

                }
            );



        if(!response.ok){

            throw new Error(
                "Telegram API request failed"
            );

        }


    }

}