import {
    TelegramOutgoingMessage
}
from "./models/TelegramOutgoingMessage";





export interface TelegramBotClient {





    sendMessage(

        message:
            TelegramOutgoingMessage

    ):
        Promise<void>;







    sendPhoto(

        message: {

            chatId:
                string;



            photo:
                string | Uint8Array;



            caption?:
                string;



            replyMarkup?:
                TelegramOutgoingMessage["replyMarkup"];



        }

    ):
        Promise<void>;







    sendDocument(

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
        Promise<void>;







    setMyCommands(

        commands:
            {

                command:
                    string;


                description:
                    string;

            }[]

    ):
        Promise<void>;



}