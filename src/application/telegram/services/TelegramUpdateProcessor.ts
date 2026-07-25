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



export class TelegramUpdateProcessor {




    constructor(


        private readonly mapper:
            TelegramUpdateMapper,


        private readonly handler:
            TelegramMessageHandler,


        private readonly formatter:
            TelegramResponseFormatter,


        private readonly botClient:
            TelegramBotClient



    ) {}







    async process(

        update:
            TelegramUpdate

    ): Promise<void> {



        const message =


            this.mapper.map(update);






        const response =


            await this.handler.handle({


                userId:
                    message.userId,


                text:
                    message.text



            });







        const formattedResponse =


            this.formatter.format(

                response

            );






        console.log(

            "FINAL TELEGRAM RESPONSE:",

            formattedResponse

        );







        await this.botClient.sendMessage({



            chatId:

                String(message.chatId),





            text:

                formattedResponse,





            replyMarkup:

                typeof response === "string"

                    ? undefined

                    :

                    response.replyMarkup,





            parseMode:

                "HTML"



        });




    }



}