import type { TelegramUpdate }
from "./models/TelegramUpdate";


export interface MappedTelegramMessage {


    chatId: number;


    text: string;


    userId: string;


    username?: string;


    firstName?: string;


}



export class TelegramUpdateMapper {


    map(

        update: TelegramUpdate

    ): MappedTelegramMessage | null {



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

                message.text ?? ""



        };


    }


}