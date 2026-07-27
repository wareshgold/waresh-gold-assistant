import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";







export class OpenAssistantMenuCallbackHandler

extends BaseMenuCallbackHandler {




    constructor(

        navigationService:
            TelegramNavigationService

    ) {


        super(

            "menu:assistant",

            "🤖 منوی دستیار",

            () =>

                navigationService.getAssistantMenu()

        );


    }





}