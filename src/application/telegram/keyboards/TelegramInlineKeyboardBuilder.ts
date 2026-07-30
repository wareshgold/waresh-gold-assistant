import {
    TelegramMenuItem,
} from "../menu/TelegramMenuItem";


import {
    TelegramKeyboardMarkup,
} from "./TelegramKeyboardMarkup";


import {
    TelegramMenuActionType,
} from "../menu/TelegramMenuAction";





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

                                ),


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



        if (

            item.action.type !==

            TelegramMenuActionType.CALLBACK

        ) {


            return item.action.value;


        }






        return this.normalizeCallbackAction(

            item.action.value

        );


    }









    private normalizeCallbackAction(

        value:
            string

    ):
        string {



        const mappings:

            Record<string, string> = {



                "menu:main":

                    "menu:main",


                "menu:market":

                    "menu:market",


                "menu:calculate":

                    "menu:calculate",


                "menu:assistant":

                    "menu:assistant",


                "menu:settings":

                    "menu:settings",






                "gold:price":

                    "gold:price",


                "gold:bubble":

                    "gold:bubble",


                "market:history":

                    "market:history",


                "market:chart":

                    "market:chart",


                "market:analytics":

                    "market:analytics",






                "calculator:gold-price":

                    "calculator:gold-price",


                "calculator:invoice":

                    "calculator:invoice",


                "calculator:formula":

                    "calculator:formula",


                "calculator:reverse-labor":

                    "calculator:reverse-labor",






                "assistant:ai":

                    "assistant:ai",


                "assistant:learn":

                    "assistant:learn",


                "assistant:help":

                    "assistant:help",






                "settings:alerts":

                    "settings:alerts",


                "settings:account":

                    "settings:account",


                "settings:bot":

                    "settings:bot",


            };






        return (

            mappings[value]

            ??

            value

        );


    }


}