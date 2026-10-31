import { TelegramMenuItem } from "./TelegramMenuItem";
import { TelegramMenuActionType } from "./TelegramMenuAction";
import { TelegramBackMenuItem } from "./TelegramMenuItems";
import { NavigationAction } from "../navigation/NavigationAction";

export const TelegramAlertsMenu: TelegramMenuItem[] = [
    {
        id: "alerts.price-target",
        label: "🎯 هشدار رسیدن به قیمت",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_PRICE_TARGET,
        },
    },
    {
        id: "alerts.bubble",
        label: "🫧 هشدار حباب طلا",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_BUBBLE,
        },
    },
    {
        id: "alerts.periodic-price",
        label: "🔔 اعلان قیمت خودکار",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_PERIODIC_PRICE,
        },
    },
    {
        id: "alerts.reports",
        label: "📊 گزارش بازار",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ALERTS_REPORTS,
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
