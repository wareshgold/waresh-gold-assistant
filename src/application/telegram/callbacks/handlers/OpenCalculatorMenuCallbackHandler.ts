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
    TelegramCalculatorMenu,
}
from "../../menu/TelegramCalculatorMenu";





export class OpenCalculatorMenuCallbackHandler

implements TelegramCallbackHandler {




    private readonly keyboardBuilder =
        new TelegramInlineKeyboardBuilder();







    canHandle(

        context:
            TelegramCallbackContext

    ): boolean {


        return context.data === "menu:calculate";


    }









    async execute(

        context:
            TelegramCallbackContext

    ):
        Promise<TelegramCommandResponse> {




        const items =

            TelegramCalculatorMenu;








        return {


            type:

                "text",



            content:

                "🧮 منوی محاسبات",



            replyMarkup:

                this.keyboardBuilder.build(

                    items

                ),


        };


    }




}