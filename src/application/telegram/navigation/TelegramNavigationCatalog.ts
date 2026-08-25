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



export type TelegramNavigationMenuId =

    | "main"

    | "market"

    | "calculate"

    | "assistant"

    | "settings"

    | "strategy";





export class TelegramNavigationCatalog {



    private readonly menus:

        Record<

            TelegramNavigationMenuId,

            TelegramMenuItem[]

        > = {


            main:

                TelegramMainMenu,


            market:

                TelegramMarketMenu,


            calculate:

                TelegramCalculatorMenu,


            assistant:

                TelegramAssistantMenu,


            settings:

                TelegramSettingsMenu,


            strategy:

                TelegramStrategyMenu,

        };





    get(

        menuId:

            TelegramNavigationMenuId

    ):

        TelegramMenuItem[] {


        return this.menus[menuId];



    }



}
