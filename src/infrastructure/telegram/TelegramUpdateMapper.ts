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

    ): MappedTelegramMessage {



        const id =

            update.message?.chat?.id ??

            update.message?.from?.id;




        if (!id) {


            throw new Error(

                "Telegram chat id missing"

            );


        }




        return {


            chatId: id,


            userId:

                String(

                    update.message?.from?.id ?? id

                ),



            username:

                update.message?.from?.username,



            firstName:

                update.message?.from?.first_name,



            text:

                update.message?.text ?? ""



        };


    }


}