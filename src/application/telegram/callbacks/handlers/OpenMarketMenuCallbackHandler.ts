import {
    TelegramCallbackHandler,
} from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext,
} from "../TelegramCallbackContext";


import {
    TelegramCommandResponse,
} from "../../commands/TelegramCommandHandler";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";





export class OpenMarketMenuCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly navigationService:
            TelegramNavigationService

    ) {}





    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return context.data === "menu:market";


    }









    async execute(

        context:
            TelegramCallbackContext

    ):
        Promise<TelegramCommandResponse> {



        return {


            type:

                "text",



            content:

                "📊 منوی بازار",



            replyMarkup:

                this.navigationService.getMarketMenu(),


        };


    }




}