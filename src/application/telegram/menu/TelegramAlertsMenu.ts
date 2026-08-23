import { TelegramMenuItem } from "./TelegramMenuItem";
import { TelegramMenuActionType } from "./TelegramMenuAction";
import { TelegramBackMenuItem } from "./TelegramMenuItems";
import { NavigationAction } from "../navigation/NavigationAction";

export const TelegramAlertsMenu: TelegramMenuItem[] = [
    {
        id: "alerts.live-price",
        label: "📌 قیمت لحظه‌ای",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_LIVE_PRICE,
        },
    },
    {
        id: "alerts.market-analysis",
        label: "📊 تحلیل و تغییرات بازار",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_MARKET_ANALYSIS,
        },
    },
    {
        id: "alerts.price-target",
        label: "🎯 هشدار رسیدن به قیمت",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_PRICE_TARGET,
        },
    },
    {
        id: "alerts.my-alerts",
        label: "📋 هشدارهای من",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_MY_ALERTS,
        },
    },
    TelegramBackMenuItem,
];
