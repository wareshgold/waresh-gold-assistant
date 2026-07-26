import {
    TelegramCallbackHandler,
}
from "../TelegramCallbackHandler";


import {
    TelegramCallbackContext,
}
from "../TelegramCallbackContext";


import {
    TelegramCommandResponse,
}
from "../../commands/TelegramCommandHandler";


import {
    TelegramInlineKeyboardBuilder,
}
from "../../keyboards/TelegramInlineKeyboardBuilder";


import {
    TelegramSettingsMenu,
}
from "../../menu/TelegramSettingsMenu";





export class OpenSettingsMenuCallbackHandler

implements TelegramCallbackHandler {




    private readonly keyboardBuilder =

        new TelegramInlineKeyboardBuilder();







    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return context.data === "menu:settings";


    }









    async execute(

        context:
            TelegramCallbackContext

    ):
        Promise<TelegramCommandResponse> {




        const items =

            TelegramSettingsMenu;








        return {


            type:

                "text",



            content:

                "⚙️ منوی تنظیمات",



            replyMarkup:

                this.keyboardBuilder.build(

                    items

                ),



        };


    }




}