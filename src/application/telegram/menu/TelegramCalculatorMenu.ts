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
                NavigationAction.CALCULATE_GOLD_PRICE,

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
                NavigationAction.CALCULATE_INVOICE,

        },

    },




    {
        id:
            "calculate.reverse-labor",

        label:
            "🔄 محاسبه معکوس طلا",

        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                NavigationAction.CALCULATE_REVERSE_LABOR,

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
                NavigationAction.CALCULATE_FORMULA,

        },

    },



    TelegramBackMenuItem,

];