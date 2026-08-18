import {
    TelegramBotClient
}
from "../TelegramBotClient";


import {
    TelegramOutgoingMessage
}
from "../models/TelegramOutgoingMessage";





export class TelegramHttpBotClient

implements TelegramBotClient {



    constructor(

        private readonly botToken:
            string

    ) {}






    async sendMessage(

        message:
            TelegramOutgoingMessage

    ): Promise<void> {



        const payload = {

            chat_id:
                message.chatId,


            text:
                message.text,


            ...(message.parseMode
                ? {
                    parse_mode:
                        message.parseMode
                }
                : {}),


            ...(message.replyMarkup
                ? {
                    reply_markup:
                        message.replyMarkup
                }
                : {})

        };





        const response =

            await fetch(

                `https://api.telegram.org/bot${this.botToken}/sendMessage`,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:

                        JSON.stringify(

                            payload

                        )

                }

            );





        if (!response.ok) {


            const errorText =

                await response.text();





            console.error(

                "TELEGRAM SEND MESSAGE FAILED",

                {

                    status:

                        response.status,


                    body:

                        errorText,



                    payload

                }

            );





            throw new Error(

                errorText

            );

        }

    }







    async sendPhoto(

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

    ): Promise<void> {



        const formData =

            new FormData();





        formData.append(

            "chat_id",

            message.chatId

        );





        formData.append(

            "photo",

            new Blob(

                [

                    typeof message.photo === "string"

                        ?

                        message.photo

                        :

                        message.photo

                ]

            )

        );





        if (message.caption) {


            formData.append(

                "caption",

                message.caption

            );


        }





        if (message.replyMarkup) {


            formData.append(

                "reply_markup",

                JSON.stringify(

                    message.replyMarkup

                )

            );


        }






        const response =

            await fetch(

                `https://api.telegram.org/bot${this.botToken}/sendPhoto`,

                {

                    method:

                        "POST",


                    body:

                        formData

                }

            );





        if (!response.ok) {


            const errorText =

                await response.text();





            console.error(

                "TELEGRAM SEND PHOTO FAILED",

                {

                    status:

                        response.status,


                    body:

                        errorText

                }

            );





            throw new Error(

                errorText

            );

        }


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

    ): Promise<void> {



        const formData =

            new FormData();





        formData.append(

            "chat_id",

            message.chatId

        );





        formData.append(

            "document",

            new Blob(

                [

                    message.document

                ]

            ),

            message.fileName

        );





        if (message.caption) {


            formData.append(

                "caption",

                message.caption

            );


        }





        if (message.replyMarkup) {


            formData.append(

                "reply_markup",

                JSON.stringify(

                    message.replyMarkup

                )

            );


        }





        const response =

            await fetch(

                `https://api.telegram.org/bot${this.botToken}/sendDocument`,

                {

                    method:

                        "POST",

                    body:

                        formData

                }

            );





        if (!response.ok) {


            const errorText =

                await response.text();





            console.error(

                "TELEGRAM SEND DOCUMENT FAILED",

                {

                    status:

                        response.status,


                    body:

                        errorText

                }

            );





            throw new Error(

                errorText

            );

        }

    }










    async setMyCommands(

        commands: {

            command:
                string;


            description:
                string;

        }[]

    ): Promise<void> {



        const response =

            await fetch(

                `https://api.telegram.org/bot${this.botToken}/setMyCommands`,

                {

                    method:

                        "POST",


                    headers: {

                        "Content-Type":
                            "application/json"

                    },


                    body:

                        JSON.stringify({

                            commands

                        })

                }

            );





        if (!response.ok) {


            const errorText =

                await response.text();





            console.error(

                "TELEGRAM SET COMMANDS FAILED",

                {

                    status:

                        response.status,


                    body:

                        errorText

                }

            );





            throw new Error(

                errorText

            );

        }


    }





}