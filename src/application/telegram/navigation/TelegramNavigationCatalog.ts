import {
    TelegramMenuItem,
} from "../menu/TelegramMenuItem";

import {
    TelegramMainMenu,
} from "../menu/TelegramMainMenu";

import {
    TelegramMarketMenu,
} from "../menu/TelegramMarketMenu";

import {
    TelegramCalculatorMenu,
} from "../menu/TelegramCalculatorMenu";

import {
    TelegramAssistantMenu,
} from "../menu/TelegramAssistantMenu";

import {
    TelegramSettingsMenu,
} from "../menu/TelegramSettingsMenu";

import {
    TelegramStrategyMenu,
} from "../menu/TelegramStrategyMenu";

import {
    TelegramAlertsMenu,
} from "../menu/TelegramAlertsMenu";


export type TelegramNavigationMenuId =
    | "main"
    | "market"
    | "calculate"
    | "assistant"
    | "strategy"
    | "alerts"
    | "settings";


export class TelegramNavigationCatalog {

    private readonly menus: Record<
        TelegramNavigationMenuId,
        TelegramMenuItem[]
    > = {

        main: TelegramMainMenu,

        market: TelegramMarketMenu,

        calculate: TelegramCalculatorMenu,

        assistant: TelegramAssistantMenu,

        strategy: TelegramStrategyMenu,

        alerts: TelegramAlertsMenu,

        settings: TelegramSettingsMenu,

    };


    get(
        menuId: TelegramNavigationMenuId
    ): TelegramMenuItem[] {

        return this.menus[menuId];

    }

}