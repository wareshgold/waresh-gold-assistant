export interface TelegramCommandContext {


    chatId: string;


    userId?: string;


    username?: string;


    command: string;


    arguments: string[];


}