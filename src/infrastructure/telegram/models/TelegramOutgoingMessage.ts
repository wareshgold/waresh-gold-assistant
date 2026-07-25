export interface TelegramReplyButton {


    text: string;


}




export interface TelegramInlineButton {


    text: string;


    callback_data: string;


}




export interface TelegramReplyMarkup {


    keyboard: TelegramReplyButton[][];



    resize_keyboard?: boolean;


}





export interface TelegramInlineKeyboardMarkup {


    inline_keyboard:

        TelegramInlineButton[][];


}





export type TelegramMarkup =


    | TelegramReplyMarkup

    | TelegramInlineKeyboardMarkup;







export interface TelegramOutgoingMessage {


    chatId: string;


    text: string;


    parseMode?: "HTML" | "MarkdownV2";



    replyMarkup?: TelegramMarkup;


}