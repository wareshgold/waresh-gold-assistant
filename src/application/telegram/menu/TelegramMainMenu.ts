import { TelegramMenuItem } from "./TelegramMenuItem";
import { TelegramMenuActionType } from "./TelegramMenuAction";
import { NavigationAction } from "../navigation/NavigationAction";

export const TelegramMainMenu: TelegramMenuItem[] = [
    {
        id: "menu.market",
        label: "🟡 بازار",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.MARKET,
        },
    },
    {
        id: "menu.gold-price",
        label: "💰 قیمت طلا",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.GOLD_PRICE,
        },
    },
    {
        id: "menu.bubble",
        label: "🫧 حباب طلا",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.GOLD_BUBBLE,
        },
    },
    {
        id: "menu.calculate",
        label: "🧮 محاسبه",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.CALCULATE,
        },
    },
    {
        id: "menu.assistant",
        label: "🤖 دستیار AI",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.ASSISTANT,
        },
    },
    {
        id: "menu.alerts",
        label: "🔔 اعلان‌ها",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.SETTINGS_ALERTS,
        },
    },
    {
        id: "menu.settings",
        label: "⚙️ تنظیمات",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.SETTINGS,
        },
    },
];
