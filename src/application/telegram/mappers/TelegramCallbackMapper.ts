import {
    TelegramCallbackContext,
}
from "../callbacks/TelegramCallbackContext";


import {
    CallbackDataParser,
}
from "../callbacks/CallbackDataParser";




export class TelegramCallbackMapper {



    constructor(

        private readonly parser:
            CallbackDataParser

            =
            new CallbackDataParser()

    ) {}





    map(

        update: any

    ): TelegramCallbackContext {



        const callbackQuery =

            update.callback_query;




        return {


            chatId:

                String(
                    callbackQuery.message.chat.id
                ),



            userId:

                String(
                    callbackQuery.from.id
                ),



            username:

                callbackQuery.from.username,



            firstName:

                callbackQuery.from.first_name,



            data:

                callbackQuery.data ?? "",



            callback:

                this.parser.parse(

                    callbackQuery.data ?? ""

                )


        };

    }


}