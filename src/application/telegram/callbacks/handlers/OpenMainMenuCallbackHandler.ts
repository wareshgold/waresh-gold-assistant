import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";







export class OpenMainMenuCallbackHandler

extends BaseMenuCallbackHandler {




    constructor(

        navigationService:
            TelegramNavigationService

    ) {


        super(

            "menu:main",

            "🟡 Waresh Gold",

            () =>

                navigationService.getMainMenu()

        );


    }





}