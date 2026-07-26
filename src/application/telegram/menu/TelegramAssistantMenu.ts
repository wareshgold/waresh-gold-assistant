import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    TelegramBackMenuItem,
} from "./TelegramMenuItems";



export const TelegramAssistantMenu: TelegramMenuItem[] = [


    {

        id:
            "assistant.ai",


        label:
            "🤖 گفتگو با AI",


        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                "assistant:ai",

        },

    },





    {

        id:
            "assistant.learn",


        label:
            "📚 آموزش طلا",


        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                "assistant:learn",

        },

    },





    {

        id:
            "assistant.help",


        label:
            "❓ راهنما",


        action: {

            type:
                TelegramMenuActionType.CALLBACK,


            value:
                "assistant:help",

        },

    },





    TelegramBackMenuItem,


];