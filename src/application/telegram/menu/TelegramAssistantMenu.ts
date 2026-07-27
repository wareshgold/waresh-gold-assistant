import {
    TelegramMenuItem,
} from "./TelegramMenuItem";


import {
    TelegramMenuActionType,
} from "./TelegramMenuAction";


import {
    TelegramBackMenuItem,
} from "./TelegramMenuItems";


import {
    NavigationAction,
} from "../navigation/NavigationAction";



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
                NavigationAction.ASSISTANT_AI,

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
                NavigationAction.ASSISTANT_LEARN,

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
                NavigationAction.ASSISTANT_HELP,

        },

    },


    TelegramBackMenuItem,

];