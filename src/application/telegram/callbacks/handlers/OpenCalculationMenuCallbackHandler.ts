import {
    BaseMenuCallbackHandler,
} from "./BaseMenuCallbackHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";




export class OpenCalculationMenuCallbackHandler

extends BaseMenuCallbackHandler {




    constructor(

        navigationService:
            TelegramNavigationService

    ) {


        super(

            "menu:calculate",

            "🧮 منوی محاسبات",

            () =>

                navigationService.getCalculatorMenu()

        );


    }





}