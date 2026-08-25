import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";





export class OpenStrategyMenuCallbackHandler
extends BaseMenuCallbackHandler {



    constructor(
        navigationService:
            TelegramNavigationService
    ) {

        super(
            "menu:strategy",
            "📈 منوی استراتژی",
            () =>
                navigationService.getMenu("strategy")
        );


    }



}
