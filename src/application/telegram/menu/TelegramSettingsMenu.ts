import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    TelegramBackMenuItem,
} from "./TelegramMenuItems";



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

                "settings:alerts",

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

                "settings:account",

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

                "settings:bot",

        },

    },





    TelegramBackMenuItem,


];