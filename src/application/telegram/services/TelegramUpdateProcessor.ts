import { TelegramUpdateMapper }
from "../../../infrastructure/telegram/TelegramUpdateMapper";


import { TelegramMessageHandler }
from "../TelegramMessageHandler";


import { TelegramResponseFormatter }
from "../TelegramResponseFormatter";


import { TelegramBotClient }
from "../../../infrastructure/telegram/TelegramBotClient";


import { TelegramUpdate }
from "../../../infrastructure/telegram/models/TelegramUpdate";


import { TelegramKeyboardMapper }
from "../../../infrastructure/telegram/TelegramKeyboardMapper";


import { TelegramCallbackProcessor }
from "./TelegramCallbackProcessor";


import {
    TelegramCommandResponse
}
from "../commands/TelegramCommandHandler";


import {
    IngestOunceTickFromTextUseCase
}
from "../../strategy-a/IngestOunceTickFromTextUseCase";




export class TelegramUpdateProcessor {



    constructor(


        private readonly mapper:
            TelegramUpdateMapper,


        private readonly handler:
            TelegramMessageHandler,


        private readonly formatter:
            TelegramResponseFormatter,


        private readonly botClient:
            TelegramBotClient,


        private readonly keyboardMapper:
            TelegramKeyboardMapper,


        private readonly callbackProcessor?:
            TelegramCallbackProcessor,


        private readonly ingestOunceTickFromTextUseCase?:
            IngestOunceTickFromTextUseCase


    ) {}    async process(
        update:
            TelegramUpdate
    ): Promise<void> {

        try {
            await this.processUpdate(update);
        } catch (error) {
            console.error("TELEGRAM_UPDATE_ERROR:", error);

            // Try to send error message to user if we have chatId
            const chatId =
                update.callback_query?.message?.chat?.id
                ?? (update as any).message?.chat?.id;

            if (chatId) {
                try {
                    await this.sendResponse(
                        {
                            type: "text",
                            content: "متأسفانه خطایی پیش اومد. لطفاً دوباره تلاش کن."
                        },
                        String(chatId)
                    );
                } catch {
                    // Can't even send error message
                }
            }
        }
    }



    private async processUpdate(
        update:
            TelegramUpdate
    ): Promise<void> {



        if (
            update.callback_query
            &&
            this.callbackProcessor
        ) {



            const chatId =
                update.callback_query.message?.chat?.id;



            if (!chatId) {
                console.warn(
                    "Ignoring callback query without chat id"
                );



                return;
            }





            const response =
                await this.callbackProcessor.process(
                    update
                );





            await this.sendResponse(
                response,
                String(chatId)
            );



            return;
        }








        const message =
            this.mapper.map(update);




        if (!message) {
            console.warn(
                "Ignoring unsupported Telegram update"
            );



            return;
        }





        if (
            this.ingestOunceTickFromTextUseCase &&
            message.text.trim()
        ) {
            const tick =
                await this.ingestOunceTickFromTextUseCase.execute(
                    message.text,
                    message.timestamp
                );



            if (tick) {
                console.log(
                    "OUNCE_TICK_INGESTED",
                    {
                        price: tick.price,
                        source: message.source
                    }
                );



                if (
                    message.source === "channel_post"
                ) {
                    return;
                }



                if (
                    !message.text.trim().startsWith("/")
                ) {
                    await this.sendResponse(
                        {
                            type: "text",
                            content:
                                `Tick انس ثبت شد: ${tick.price}`
                        },
                        String(message.chatId)
                    );



                    return;
                }

            }

        }





        if (
            message.source === "channel_post"
        ) {
            return;
        }






        const response =


            await this.handler.handleResponse({





                userId:
                    message.userId,





                text:
                    message.text,





                username:
                    message.username,





                firstName:
                    message.firstName



            });







        await this.sendResponse(
            response,
            String(
                message.chatId
            )
        );




    }








    private async sendResponse(



        response:

            string | TelegramCommandResponse,



        chatId:

            string



    ): Promise<void> {




        console.log(

            "TELEGRAM OUTGOING RESPONSE:",

            {

                chatId,

                response

            }

        );




        if (typeof response === "string") {



            const formattedResponse =

                this.formatter.format(

                    response

                );



            if (!formattedResponse.trim()) {

                console.warn(

                    "Ignoring empty Telegram string response",

                    {

                        chatId,

                        response

                    }

                );

                return;

            }




            await this.botClient.sendMessage({


                chatId,


                text:

                    formattedResponse,


                parseMode:

                    "HTML"


            });


            return;

        }






        const replyMarkup =


            response.replyMarkup

                ? this.keyboardMapper.map(

                    response.replyMarkup as any

                )

                : undefined;









        if (


            response.type === "photo"

            &&

            response.photo

        ) {



            await this.botClient.sendPhoto({



                chatId,



                photo:

                    response.photo.photo,



                caption:

                    response.photo.caption,



                replyMarkup



            });



            return;

        }









        if (


            response.type === "document"

            &&

            response.document

        ) {



            const document =

                typeof response.document.document === "string"

                    ?

                    new TextEncoder().encode(

                        response.document.document

                    )

                    :

                    response.document.document;




            await this.botClient.sendDocument({



                chatId,



                document,



                fileName:

                    response.document.fileName,



                caption:

                    response.document.caption,



                replyMarkup



            });



            return;

        }






        const formattedResponse =


            this.formatter.format(

                response

            );




        if (!formattedResponse.trim()) {

            console.warn(

                "Ignoring empty Telegram object response",

                {

                    chatId,

                    response

                }

            );

            return;

        }






        console.log(

            "TELEGRAM OUTGOING MESSAGE:",

            {

                chatId,

                text:

                    formattedResponse,

                replyMarkup

            }

        );






        await this.botClient.sendMessage({



            chatId,



            text:

                formattedResponse,



            replyMarkup,



            parseMode:

                "HTML"



        });



    }



}