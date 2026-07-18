import type { TelegramUpdate } from "./models/TelegramUpdate";


export interface MappedTelegramMessage {

    chatId: number;

    text: string;

}


export class TelegramUpdateMapper {


    map(update: TelegramUpdate): MappedTelegramMessage {


        return {

            chatId:
                update.message?.chat?.id ??
                update.message?.from?.id,

            text:
                update.message?.text ?? ""

        };

    }

}