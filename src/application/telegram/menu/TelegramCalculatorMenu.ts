import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    TelegramBackMenuItem,
} from "./TelegramMenuItems";



export const TelegramCalculatorMenu: TelegramMenuItem[] = [


    {

        id:
            "calculate.gold-price",


        label:
            "🧮 محاسبه قیمت طلا",


        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                "calculate:gold-price",

        },

    },





    {

        id:
            "calculate.invoice",


        label:
            "🧾 محاسبه فاکتور",


        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                "calculate:invoice",

        },

    },





    {

        id:
            "calculate.formula",


        label:
            "📐 حل فرمول طلا",


        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                "calculate:formula",

        },

    },





    TelegramBackMenuItem,


];