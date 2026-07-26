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




export type TelegramNavigationMenuId =

    | "main"

    | "market"

    | "calculate"

    | "assistant"

    | "settings";






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


        };






    get(

        menuId:
            TelegramNavigationMenuId

    ):
        TelegramMenuItem[] {


        return this.menus[menuId];

    }



}