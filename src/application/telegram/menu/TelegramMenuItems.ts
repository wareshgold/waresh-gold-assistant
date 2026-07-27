import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    NavigationAction,
} from "../navigation/NavigationAction";



export const TelegramBackMenuItem: TelegramMenuItem = {


    id:
        "menu.main",


    label:
        "⬅️ بازگشت",


    action: {

        type:
            TelegramMenuActionType.CALLBACK,


        value:
            NavigationAction.HOME,

    },


};