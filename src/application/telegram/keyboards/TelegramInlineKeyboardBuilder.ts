import {
    TelegramMenuItem,
} from "../menu/TelegramMenuItem";


import {
    TelegramKeyboardMarkup,
} from "./TelegramKeyboardMarkup";





export class TelegramInlineKeyboardBuilder {






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

                                item.action.value,


                        }

                    ]

                )


        };


    }


}