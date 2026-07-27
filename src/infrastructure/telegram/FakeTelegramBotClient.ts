import {
    TelegramBotClient
}
from "./TelegramBotClient";


import {
    TelegramOutgoingMessage
}
from "./models/TelegramOutgoingMessage";




export class FakeTelegramBotClient

implements TelegramBotClient {



    public messages:
        TelegramOutgoingMessage[] = [];








    async sendMessage(

        message:
            TelegramOutgoingMessage

    ):
        Promise<void> {


        this.messages.push(

            message

        );


    }









    async sendPhoto(

        message: {

            chatId:
                string;


            photo:
                Uint8Array;


            caption?:
                string;


            replyMarkup?:
                TelegramOutgoingMessage["replyMarkup"];

        }

    ):
        Promise<void> {


        this.messages.push({

            chatId:

                message.chatId,


            text:

                message.caption ?? "📊 Chart",


            replyMarkup:

                message.replyMarkup


        });


    }









    async sendDocument(

        message: {

            chatId:
                string;


            document:
                Uint8Array;


            fileName:
                string;


            caption?:
                string;


            replyMarkup?:
                TelegramOutgoingMessage["replyMarkup"];

        }

    ):
        Promise<void> {


        this.messages.push({

            chatId:

                message.chatId,


            text:

                message.caption ?? message.fileName,


            replyMarkup:

                message.replyMarkup


        });


    }





}