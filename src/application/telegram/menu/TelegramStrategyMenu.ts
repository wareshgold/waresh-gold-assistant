import { TelegramMenuItem } from "./TelegramMenuItem";
import { TelegramMenuActionType } from "./TelegramMenuAction";
import { TelegramBackMenuItem } from "./TelegramMenuItems";
import { NavigationAction } from "../navigation/NavigationAction";

export const TelegramStrategyMenu: TelegramMenuItem[] = [
    {
        id: "strategy.strategy-a",
        label: "📊 سیگنال استراتژی A",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.STRATEGY_A,
        },
    },
    TelegramBackMenuItem,
];
