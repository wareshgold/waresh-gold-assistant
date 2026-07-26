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
    TelegramAssistantMenu,
}
from "../../menu/TelegramAssistantMenu";





export class OpenAssistantMenuCallbackHandler

implements TelegramCallbackHandler {




    private readonly keyboardBuilder =
        new TelegramInlineKeyboardBuilder();







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




        const items =

            TelegramAssistantMenu;








        return {


            type:

                "text",



            content:

                "🤖 منوی دستیار",



            replyMarkup:

                this.keyboardBuilder.build(

                    items

                ),


        };


    }




}