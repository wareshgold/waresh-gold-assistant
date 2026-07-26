import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";



export class TelegramNavigationMenuFactory {



    createBackMenuItem(): TelegramMenuItem {



        return {


            id: "menu.main",


            label: "⬅️ بازگشت",


            action: {


                type:
                    TelegramMenuActionType.CALLBACK,


                value:
                    "menu:main",


            },


        };


    }




}