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

                        JSON.stringify({

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


                        })


                }

            );





        if (!response.ok) {


            throw new Error(

                await response.text()

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




        if (

            typeof message.photo === "string"

        ) {


            formData.append(

                "photo",

                new Blob(

                    [message.photo],

                    {
                        type:
                            "image/svg+xml"
                    }

                ),

                "chart.svg"

            );


        }

        else {


            formData.append(

                "photo",

                new Blob(

                    [message.photo]

                )

            );


        }





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


            throw new Error(

                await response.text()

            );


        }


    }




}