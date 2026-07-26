import {
    TelegramKeyboardMarkup,
} from "../keyboards/TelegramKeyboardMarkup";


import {
    TelegramNavigationCatalog,
} from "./TelegramNavigationCatalog";


import {
    TelegramInlineKeyboardBuilder,
} from "../keyboards/TelegramInlineKeyboardBuilder";



export interface TelegramNavigationService {


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
            TelegramInlineKeyboardBuilder = new TelegramInlineKeyboardBuilder()


    ) {}





    getMainMenu():

        TelegramKeyboardMarkup {


        return this.keyboardBuilder.build(

            this.catalog.get("main")

        );

    }





    getMarketMenu():

        TelegramKeyboardMarkup {


        return this.keyboardBuilder.build(

            this.catalog.get("market")

        );

    }





    getCalculatorMenu():

        TelegramKeyboardMarkup {


        return this.keyboardBuilder.build(

            this.catalog.get("calculate")

        );

    }





    getAssistantMenu():

        TelegramKeyboardMarkup {


        return this.keyboardBuilder.build(

            this.catalog.get("assistant")

        );

    }





    getSettingsMenu():

        TelegramKeyboardMarkup {


        return this.keyboardBuilder.build(

            this.catalog.get("settings")

        );

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

                            "menu:main",

                    }

                ]

            ]

        };

    }


}