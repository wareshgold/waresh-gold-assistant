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
            "❓ راهنما",

        action: {

            type:
                TelegramMenuActionType.CALLBACK,

            value:
                NavigationAction.ASSISTANT_HELP,

        },

    },



    {
        id:
            "settings.about",

        label:
            "ℹ️ درباره ربات",

        action: {

            type:
                TelegramMenuActionType.CALLBACK,

            value:
                NavigationAction.SETTINGS_ABOUT,

        },

    },


    TelegramBackMenuItem,

];