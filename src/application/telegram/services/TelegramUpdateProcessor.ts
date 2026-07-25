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
            TelegramKeyboardMapper



    ) {}








    async process(

        update:
            TelegramUpdate

    ): Promise<void> {



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







        console.log(

            "FINAL TELEGRAM RESPONSE:",

            formattedResponse

        );






        const replyMarkup =


            typeof response === "string"


                ? undefined


                : response.keyboard

                    ? this.keyboardMapper.map(

                        response.keyboard

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