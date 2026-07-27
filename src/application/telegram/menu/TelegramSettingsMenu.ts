import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    TelegramBackMenuItem,
} from "./TelegramMenuItems";


import {
    NavigationAction,
} from "../navigation/NavigationAction";



export const TelegramSettingsMenu: TelegramMenuItem[] = [


    {
        id:
            "settings.alerts",

        label:
            "🔔 تنظیم اعلان‌ها",

        action: {

            type:
                TelegramMenuActionType.CALLBACK,

            value:
                NavigationAction.SETTINGS_ALERTS,

        },

    },



    {
        id:
            "settings.account",

        label:
            "👤 حساب کاربری",

        action: {

            type:
                TelegramMenuActionType.CALLBACK,

            value:
                NavigationAction.SETTINGS_ACCOUNT,

        },

    },



    {
        id:
            "settings.bot",

        label:
            "⚙️ تنظیمات ربات",

        action: {

            type:
                TelegramMenuActionType.CALLBACK,

            value:
                NavigationAction.SETTINGS_BOT,

        },

    },


    TelegramBackMenuItem,

];