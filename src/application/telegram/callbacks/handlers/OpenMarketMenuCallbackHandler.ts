import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";







export class OpenMarketMenuCallbackHandler

extends BaseMenuCallbackHandler {




    constructor(

        navigationService:
            TelegramNavigationService

    ) {


        super(

            "menu:market",

            "📊 منوی بازار",

            () =>

                navigationService.getMarketMenu()

        );


    }





}