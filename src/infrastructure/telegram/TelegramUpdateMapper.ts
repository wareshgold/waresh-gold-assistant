import type { TelegramUpdate } from "./models/TelegramUpdate";


export interface MappedTelegramMessage {

    chatId: number;

    text: string;

    userId: string;

}



export class TelegramUpdateMapper {


    map(update: TelegramUpdate): MappedTelegramMessage {


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

            userId: String(
                update.message?.from?.id ?? id
            ),

            text:
                update.message?.text ?? ""

        };


    }

}