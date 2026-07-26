import {
    TelegramMenuItem,
} from "../menu/TelegramMenuItem";


import {
    TelegramNavigationCatalog,
    TelegramNavigationMenuId,
} from "./TelegramNavigationCatalog";





export interface TelegramNavigationService {


    getMenu(
        menuId:
            TelegramNavigationMenuId
    ):
        TelegramMenuItem[];



    getMainMenu():
        TelegramMenuItem[];



    getMarketMenu():
        TelegramMenuItem[];



    getCalculatorMenu():
        TelegramMenuItem[];



    getAssistantMenu():
        TelegramMenuItem[];



    getSettingsMenu():
        TelegramMenuItem[];


}





export class DefaultTelegramNavigationService

implements TelegramNavigationService {



    constructor(

        private readonly catalog:
            TelegramNavigationCatalog

    ) {}





    getMenu(

        menuId:
            TelegramNavigationMenuId

    ):
        TelegramMenuItem[] {


        return this.catalog.get(

            menuId

        );


    }





    getMainMenu():

        TelegramMenuItem[] {


        return this.getMenu(

            "main"

        );

    }





    getMarketMenu():

        TelegramMenuItem[] {


        return this.getMenu(

            "market"

        );

    }





    getCalculatorMenu():

        TelegramMenuItem[] {


        return this.getMenu(

            "calculate"

        );

    }





    getAssistantMenu():

        TelegramMenuItem[] {


        return this.getMenu(

            "assistant"

        );

    }





    getSettingsMenu():

        TelegramMenuItem[] {


        return this.getMenu(

            "settings"

        );

    }



}