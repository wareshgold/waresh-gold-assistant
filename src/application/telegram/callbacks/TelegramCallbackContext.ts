import {
  CallbackAction,
} from "./CallbackAction";



export interface TelegramCallbackContext {


    chatId: string;


    userId?: string;


    username?: string;


    firstName?: string;



    data: string;



    callback:

        CallbackAction;


}