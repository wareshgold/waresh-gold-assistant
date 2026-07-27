import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";







export class OpenSettingsMenuCallbackHandler

extends BaseMenuCallbackHandler {




    constructor(

        navigationService:
            TelegramNavigationService

    ) {


        super(

            "menu:settings",

            "⚙️ منوی تنظیمات",

            () =>

                navigationService.getSettingsMenu()

        );


    }





}