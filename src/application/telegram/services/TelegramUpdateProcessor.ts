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
            TelegramCallbackProcessor



    ) {}









    async process(

        update:
            TelegramUpdate

    ): Promise<void> {



        if (

            update.callback_query

            &&

            this.callbackProcessor

        ) {



            const response =

                await this.callbackProcessor.process(

                    update

                );





            const formattedResponse =

                this.formatter.format(

                    response

                );





            await this.botClient.sendMessage({


                chatId:

                    String(

                        update.callback_query.message?.chat?.id

                    ),


                text:

                    formattedResponse,


                parseMode:

                    "HTML"


            });



            return;

        }








        const message =


            this.mapper.map(update);








        const response =


            await this.handler.handleResponse({


                userId:

                    message.userId,


                text:

                    message.text



            });








        const formattedResponse =


            this.formatter.format(

                response

            );








        const replyMarkup =


            typeof response === "string"


                ? undefined


                : response.replyMarkup

                    ? this.keyboardMapper.map(

                        response.replyMarkup

                    )

                    : undefined;








        await this.botClient.sendMessage({



            chatId:

                String(message.chatId),




            text:

                formattedResponse,




            replyMarkup,




            parseMode:

                "HTML"



        });



    }





}