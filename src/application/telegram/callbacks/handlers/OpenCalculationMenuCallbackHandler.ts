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
    TelegramMenuItem,
} from "../../menu/TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "../../menu/TelegramMenuAction";


import {
    TelegramNavigationMenuFactory,
} from "../../menu/TelegramNavigationMenuFactory";



export class OpenCalculationMenuCallbackHandler

implements TelegramCallbackHandler {



    private readonly keyboardBuilder =
        new TelegramInlineKeyboardBuilder();



    private readonly navigationMenuFactory =
        new TelegramNavigationMenuFactory();







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



        const items:

            TelegramMenuItem[] = [



                {

                    id: "gold.calculate",

                    label: "🧮 محاسبه خرید طلا",

                    action: {

                        type:
                            TelegramMenuActionType.COMMAND,

                        value:
                            "calc",

                    },

                },




                {

                    id: "gold.sell",

                    label: "💰 محاسبه فروش طلا",

                    action: {

                        type:
                            TelegramMenuActionType.COMMAND,

                        value:
                            "sell",

                    },

                },




                {

                    id: "invoice.calculate",

                    label: "🧾 محاسبه فاکتور",

                    action: {

                        type:
                            TelegramMenuActionType.COMMAND,

                        value:
                            "invoice",

                    },

                },




                {

                    id: "labor.tax",

                    label: "⚖️ اجرت و مالیات",

                    action: {

                        type:
                            TelegramMenuActionType.COMMAND,

                        value:
                            "tax",

                    },

                },




                this.navigationMenuFactory.createBackMenuItem(),



            ];







        return {


            type:
                "text",



            content:

                "🧮 منوی محاسبات",



            replyMarkup:

                this.keyboardBuilder.build(items),


        };


    }


}