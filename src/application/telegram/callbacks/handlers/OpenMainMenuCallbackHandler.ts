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



export class OpenMainMenuCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly telegramNavigationService:
            TelegramNavigationService

    ) {}






    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return context.data === "menu:main";


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

                "🟡 Waresh Gold",



            replyMarkup:

                this.telegramNavigationService.getMainMenu(),


        };


    }


}