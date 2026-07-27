import {
    TelegramKeyboardMarkup,
} from "../keyboards/TelegramKeyboardMarkup";


import {
    TelegramNavigationCatalog,
    TelegramNavigationMenuId,
} from "./TelegramNavigationCatalog";


import {
    TelegramInlineKeyboardBuilder,
} from "../keyboards/TelegramInlineKeyboardBuilder";


import {
    NavigationAction,
} from "./NavigationAction";


import {
    TelegramNavigationStateService,
} from "./TelegramNavigationStateService";



export interface TelegramNavigationService {


    getMenu(
        menuId: TelegramNavigationMenuId
    ):
        TelegramKeyboardMarkup;



    getMainMenu():

        TelegramKeyboardMarkup;



    getMarketMenu():

        TelegramKeyboardMarkup;



    getCalculatorMenu():

        TelegramKeyboardMarkup;



    getAssistantMenu():

        TelegramKeyboardMarkup;



    getSettingsMenu():

        TelegramKeyboardMarkup;



    backMenu():

        TelegramKeyboardMarkup;


}







export class DefaultTelegramNavigationService

implements TelegramNavigationService {



    constructor(


        private readonly catalog:

            TelegramNavigationCatalog = new TelegramNavigationCatalog(),



        private readonly keyboardBuilder:

            TelegramInlineKeyboardBuilder = new TelegramInlineKeyboardBuilder(),



        private readonly navigationState:

            TelegramNavigationStateService | null = null


    ) {}







    getMenu(

        menuId:

            TelegramNavigationMenuId

    ):

        TelegramKeyboardMarkup {


        return this.keyboardBuilder.build(

            this.catalog.get(menuId)

        );


    }









    getMainMenu():

        TelegramKeyboardMarkup {


        return this.getMenu("main");


    }









    getMarketMenu():

        TelegramKeyboardMarkup {


        return this.getMenu("market");


    }









    getCalculatorMenu():

        TelegramKeyboardMarkup {


        return this.getMenu("calculate");


    }









    getAssistantMenu():

        TelegramKeyboardMarkup {


        return this.getMenu("assistant");


    }









    getSettingsMenu():

        TelegramKeyboardMarkup {


        return this.getMenu("settings");


    }









    backMenu():

        TelegramKeyboardMarkup {


        return {

            type:

                "INLINE",


            rows: [

                [

                    {

                        text:

                            "⬅️ بازگشت",


                        actionId:

                            NavigationAction.BACK,

                    }

                ]

            ]

        };


    }



}