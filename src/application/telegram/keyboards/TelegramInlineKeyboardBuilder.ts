import {
    TelegramMenuItem,
}
from "../menu/TelegramMenuItem";


import {
    TelegramKeyboardMarkup,
}
from "./TelegramKeyboardMarkup";


import {
    TelegramMenuActionType,
}
from "../menu/TelegramMenuAction";







export class TelegramInlineKeyboardBuilder {





    build(

        items:

            TelegramMenuItem[]

    ):

        TelegramKeyboardMarkup {



        return {


            type:

                "INLINE",



            rows:

                items.map(

                    item => [


                        {

                            text:

                                item.label,


                            actionId:

                                this.resolveActionId(

                                    item

                                )

                        }


                    ]

                )


        };


    }








    private resolveActionId(

        item:

            TelegramMenuItem

    ):

        string {



        return item.action.type === TelegramMenuActionType.CALLBACK

            ? item.action.value

            :

            item.action.value;


    }



}