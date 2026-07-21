export interface TelegramCommandContext {


    chatId: string;


    userId?: string;


    username?: string;


    firstName?: string;


    command: string;


    arguments: string[];


}