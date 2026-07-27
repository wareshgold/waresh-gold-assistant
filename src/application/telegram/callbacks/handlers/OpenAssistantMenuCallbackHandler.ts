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





export class OpenAssistantMenuCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly navigationService:
            TelegramNavigationService

    ) {}





    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return context.data === "menu:assistant";


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

                "🤖 منوی دستیار",



            replyMarkup:

                this.navigationService.getAssistantMenu(),


        };


    }




}