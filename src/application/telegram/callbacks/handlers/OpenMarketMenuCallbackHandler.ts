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



        const items:

            TelegramMenuItem[] = [



                {

                    id: "gold.price",

                    label: "💰 قیمت لحظه‌ای",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "gold:price",

                    },

                },




                {

                    id: "market.history",

                    label: "📜 تاریخچه قیمت",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "market:history",

                    },

                },




                {

                    id: "gold.bubble",

                    label: "🫧 حباب طلا",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "gold:bubble",

                    },

                },




                {

                    id: "market.analytics",

                    label: "📈 تحلیل بازار",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "market:analytics",

                    },

                },



            ];





        return {


            type:
                "text",



            content:

                "📊 منوی بازار",



            replyMarkup:

                this.keyboardBuilder.build(items),


        };


    }


}