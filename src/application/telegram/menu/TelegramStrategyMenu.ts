import { TelegramMenuItem } from "./TelegramMenuItem";
import { TelegramMenuActionType } from "./TelegramMenuAction";
import { TelegramBackMenuItem } from "./TelegramMenuItems";
import { NavigationAction } from "../navigation/NavigationAction";

export const TelegramStrategyMenu: TelegramMenuItem[] = [
    {
        id: "strategy.strategy-a",
        label: "📊 استراتژی A (سیگنال طلا)",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.STRATEGY_A,
        },
    },
    {
        id: "strategy.sp2l",
        label: "📈 استراتژی SP2L",
        action: {
            type: TelegramMenuActionType.CALLBACK,
            value: NavigationAction.SP2L,
        },
    },
    TelegramBackMenuItem,
];
