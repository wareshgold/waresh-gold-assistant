import type { TelegramUpdate }
from "./models/TelegramUpdate";


export interface MappedTelegramMessage {


    chatId: number;


    text: string;


    userId: string;


    username?: string;


    firstName?: string;


    source:
        "message"
        |
        "channel_post";


    timestamp: number;


}




export class TelegramUpdateMapper {


    map(

        update: TelegramUpdate

    ): MappedTelegramMessage | null {



        const channelPost =
            update.channel_post;

        if (
            channelPost?.text
        ) {

            const id =
                channelPost.chat?.id;

            if (!id) {
                return null;
            }

            return {

                chatId: id,


                userId:
                    String(id),


                username:
                    channelPost.chat?.username,


                firstName:
                    channelPost.chat?.title,


                text:
                    channelPost.text,


                source:
                    "channel_post",


                timestamp:
                    channelPost.date
                        ? channelPost.date * 1000
                        : Date.now()

            };

        }



        const message = update.message;



        if (!message) {

            return null;

        }



        const id =

            message.chat?.id ??

            message.from?.id;



        if (!id) {

            return null;

        }



        return {


            chatId: id,


            userId:

                String(

                    message.from?.id ?? id

                ),



            username:

                message.from?.username,



            firstName:

                message.from?.first_name,



            text:

                message.text ?? "",


            source:
                "message",


            timestamp:
                message.date
                    ? message.date * 1000
                    : Date.now()



        };

    }


}