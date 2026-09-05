import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";

import { TelegramFooter } from "../../presentation/TelegramFooter";







export class OpenMainMenuCallbackHandler

extends BaseMenuCallbackHandler {




    constructor(

        navigationService:
            TelegramNavigationService

    ) {


        super(

            "menu:main",

            TelegramFooter.FOOTER,

            () =>

                navigationService.getMainMenu()

        );


    }





}