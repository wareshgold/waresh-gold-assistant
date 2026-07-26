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



export class OpenAssistantMenuCallbackHandler

implements TelegramCallbackHandler {



    private readonly keyboardBuilder =
        new TelegramInlineKeyboardBuilder();



    private readonly navigationMenuFactory =
        new TelegramNavigationMenuFactory();







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



        const items:

            TelegramMenuItem[] = [



                {

                    id: "assistant.ai",

                    label: "🤖 سوال از AI",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "assistant:ai",

                    },

                },




                {

                    id: "assistant.learn",

                    label: "📚 آموزش طلا",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "assistant:learn",

                    },

                },




                {

                    id: "assistant.help",

                    label: "ℹ️ راهنما",

                    action: {

                        type:
                            TelegramMenuActionType.CALLBACK,

                        value:
                            "assistant:help",

                    },

                },




                this.navigationMenuFactory.createBackMenuItem(),



            ];







        return {


            type:
                "text",



            content:

                "🤖 منوی دستیار",



            replyMarkup:

                this.keyboardBuilder.build(items),


        };


    }


}