import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";





export class OpenAlertsMenuCallbackHandler
extends BaseMenuCallbackHandler {



    constructor(
        navigationService:
            TelegramNavigationService
    ) {

        super(
            "menu:alerts",
            "🔔 منوی اعلان‌ها",
            () =>
                navigationService.getMenu("alerts")
        );


    }



}
