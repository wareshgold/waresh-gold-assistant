export interface TelegramReplyMarkup {


    keyboard: {


        text: string;


    }[][];



    resize_keyboard?: boolean;


}




export interface TelegramOutgoingMessage {


    chatId: string;


    text: string;


    parseMode?: "HTML" | "MarkdownV2";



    replyMarkup?: TelegramReplyMarkup;


}