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
    TelegramMenuService,
} from "../../menu/TelegramMenuService";



export class OpenMainMenuCallbackHandler

implements TelegramCallbackHandler {



    constructor(

        private readonly telegramMenuService:
            TelegramMenuService,


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

            this.telegramMenuService.getMainMenu();






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