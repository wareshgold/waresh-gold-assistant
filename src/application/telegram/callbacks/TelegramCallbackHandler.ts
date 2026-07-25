import {
  TelegramCallbackContext,
} from "./TelegramCallbackContext";



export interface TelegramCallbackHandler {



    canHandle(

        context:
            TelegramCallbackContext

    ):
        boolean;





    execute(

        context:
            TelegramCallbackContext

    ):
        Promise<any>;



}