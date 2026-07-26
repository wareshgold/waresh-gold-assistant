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
    TelegramMarketMenu,
} from "../../menu/TelegramMarketMenu";





export class OpenMarketMenuCallbackHandler

implements TelegramCallbackHandler {




    private readonly keyboardBuilder =
        new TelegramInlineKeyboardBuilder();







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




        const items =

            TelegramMarketMenu;








        return {


            type:

                "text",



            content:

                "📊 منوی بازار",



            replyMarkup:

                this.keyboardBuilder.build(

                    items

                ),


        };


    }




}