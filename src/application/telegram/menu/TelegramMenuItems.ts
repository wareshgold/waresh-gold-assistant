import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";



export const TelegramBackMenuItem: TelegramMenuItem = {


    id: "menu.main",


    label: "⬅️ بازگشت",


    action: {


        type:
            TelegramMenuActionType.CALLBACK,


        value:
            "menu:main",


    },


};