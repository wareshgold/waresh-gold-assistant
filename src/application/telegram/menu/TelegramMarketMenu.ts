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



export const TelegramMarketMenu: TelegramMenuItem[] = [


    {
        id: "gold.price",

        label: "💰 قیمت لحظه‌ای",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.GOLD_PRICE,
        },
    },


    {
        id: "market.history",

        label: "📜 تاریخچه قیمت",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.MARKET_HISTORY,
        },
    },


    {
        id: "gold.bubble",

        label: "🫧 حباب طلا",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.GOLD_BUBBLE,
        },
    },


    {
        id: "market.analytics",

        label: "📈 تحلیل بازار",

        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.MARKET_ANALYTICS,
        },
    },


    TelegramBackMenuItem,

];