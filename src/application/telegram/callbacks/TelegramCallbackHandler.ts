import {
  TelegramCallbackContext,
} from "./TelegramCallbackContext";


import {
  TelegramCommandResponse,
} from "../commands/TelegramCommandHandler";



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
        Promise<TelegramCommandResponse | string>;

}