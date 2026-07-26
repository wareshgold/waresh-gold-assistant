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




export class OpenSettingsMenuCallbackHandler

implements TelegramCallbackHandler {



    private readonly keyboardBuilder =

        new TelegramInlineKeyboardBuilder();




    private readonly navigationMenuFactory =

        new TelegramNavigationMenuFactory();






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



        const items:

            TelegramMenuItem[] = [



                {

                    id:

                        "settings.alerts",


                    label:

                        "🔔 هشدار قیمت",


                    action: {

                        type:

                            TelegramMenuActionType.CALLBACK,


                        value:

                            "settings:alerts",

                    },

                },





                {

                    id:

                        "settings.account",


                    label:

                        "👤 حساب کاربری",


                    action: {

                        type:

                            TelegramMenuActionType.CALLBACK,


                        value:

                            "settings:account",

                    },

                },





                {

                    id:

                        "settings.bot",


                    label:

                        "🔧 تنظیمات بات",


                    action: {

                        type:

                            TelegramMenuActionType.CALLBACK,


                        value:

                            "settings:bot",

                    },

                },





                this.navigationMenuFactory.createBackMenuItem(),



            ];









        return {


            type:

                "text",



            content:

                "⚙️ منوی تنظیمات",



            replyMarkup:

                this.keyboardBuilder.build(items),



        };


    }


}