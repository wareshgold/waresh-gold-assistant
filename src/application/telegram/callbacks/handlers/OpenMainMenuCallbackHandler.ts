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
    TelegramInlineKeyboardBuilder,
} from "../../keyboards/TelegramInlineKeyboardBuilder";


import {
    TelegramNavigationService,
} from "../../navigation/TelegramNavigationService";




export class OpenMainMenuCallbackHandler

implements TelegramCallbackHandler {



    constructor(


        private readonly telegramNavigationService:
            TelegramNavigationService,



        private readonly telegramInlineKeyboardBuilder:
            TelegramInlineKeyboardBuilder


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



        const menuItems =


            this.telegramNavigationService.getMainMenu();








        return {


            type:

                "text",



            content:

                "🟡 Waresh Gold",



            replyMarkup:


                this.telegramInlineKeyboardBuilder.build(


                    menuItems


                ),



        };


    }


}