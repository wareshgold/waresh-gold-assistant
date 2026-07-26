import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    TelegramBackMenuItem,
} from "./TelegramMenuItems";



export const TelegramMarketMenu: TelegramMenuItem[] = [

    {
        id: "gold.price",

        label: "💰 قیمت لحظه‌ای",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: "gold:price",
        },
    },


    {
        id: "market.history",

        label: "📜 تاریخچه قیمت",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: "market:history",
        },
    },


    {
        id: "gold.bubble",

        label: "🫧 حباب طلا",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: "gold:bubble",
        },
    },


    {
        id: "market.analytics",

        label: "📈 تحلیل بازار",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: "market:analytics",
        },
    },


    TelegramBackMenuItem,

];