import {
    TelegramMenuItem,
} from "../menu/TelegramMenuItem";


import {
    TelegramMenuCallbackResolver,
} from "../menu/TelegramMenuCallbackResolver";


import {
    TelegramKeyboardMarkup,
} from "./TelegramKeyboardMarkup";




export class TelegramInlineKeyboardBuilder {



    constructor(

        private readonly callbackResolver:
            TelegramMenuCallbackResolver = new TelegramMenuCallbackResolver()

    ) {}





    build(

        items: TelegramMenuItem[]

    ): TelegramKeyboardMarkup {


        return {


            type: "INLINE",


            rows:

                items.map(

                    item => [


                        {

                            text:

                                item.label,


                            actionId:

                                this.callbackResolver.resolve(item),


                        }

                    ]

                )


        };


    }


}