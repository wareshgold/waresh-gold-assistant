import {
    TelegramMenuItem,
}
from "../menu/TelegramMenuItem";


import {
    TelegramKeyboardMarkup,
}
from "./TelegramKeyboardMarkup";




export class TelegramInlineKeyboardBuilder {




    build(

        items:
            TelegramMenuItem[]

    ): TelegramKeyboardMarkup {



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

                                this.createCallbackData(

                                    item

                                ),



                        }


                    ]

                )



        };


    }







    private createCallbackData(

        item:
            TelegramMenuItem

    ): string {



        switch (

            item.id

        ) {



            case "gold.price":

                return "gold:price";



            case "gold.bubble":

                return "gold:bubble";



            case "gold.calculate":

                return "calculator:start";



            case "market.analytics":

                return "market:analytics";



            case "market.history":

                return "market:history";



            default:

                return item.id.replace(

                    ".",

                    ":"

                );


        }


    }



}