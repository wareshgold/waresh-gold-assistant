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
    TelegramMenuItem,
}
from "../../menu/TelegramMenuItem";


import {
    TelegramMenuActionType,
}
from "../../menu/TelegramMenuAction";


import {
    TelegramNavigationMenuFactory,
}
from "../../menu/TelegramNavigationMenuFactory";





export class OpenCalculatorMenuCallbackHandler

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

                    id:
                        "calculate.gold-price",


                    label:
                        "💰 محاسبه قیمت طلا",


                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,


                        value:
                            "calculate:gold-price",

                    },

                },






                {

                    id:
                        "calculate.invoice",


                    label:
                        "🧾 محاسبه فاکتور",


                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,


                        value:
                            "calculate:invoice",

                    },

                },






                {

                    id:
                        "calculate.formula",


                    label:
                        "🧮 حل فرمول طلا",


                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,


                        value:
                            "calculate:formula",

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