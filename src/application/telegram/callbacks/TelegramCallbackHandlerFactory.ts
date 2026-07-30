import {
    TelegramCallbackHandler,
}
from "./TelegramCallbackHandler";


import {
    ActionCallbackHandler,
}
from "./handlers/ActionCallbackHandler";


import {
    OpenMarketMenuCallbackHandler,
}
from "./handlers/OpenMarketMenuCallbackHandler";


import {
    OpenCalculatorMenuCallbackHandler,
}
from "./handlers/OpenCalculatorMenuCallbackHandler";


import {
    OpenAssistantMenuCallbackHandler,
}
from "./handlers/OpenAssistantMenuCallbackHandler";


import {
    OpenSettingsMenuCallbackHandler,
}
from "./handlers/OpenSettingsMenuCallbackHandler";


import {
    OpenMainMenuCallbackHandler,
}
from "./handlers/OpenMainMenuCallbackHandler";


import {
    BackNavigationCallbackHandler,
}
from "./handlers/BackNavigationCallbackHandler";


import {
    TelegramActionExecutor,
}
from "../actions/TelegramActionExecutor";


import {
    TelegramNavigationService,
}
from "../navigation/TelegramNavigationService";


import {
    TelegramNavigationStateService,
}
from "../navigation/TelegramNavigationStateService";





export class TelegramCallbackHandlerFactory {





    static create(



        telegramActionExecutor:

            TelegramActionExecutor,



        telegramNavigationService:

            TelegramNavigationService,



        telegramNavigationStateService:

            TelegramNavigationStateService



    ):

        TelegramCallbackHandler[] {




        return [



            /*
             * Navigation
             */



            new BackNavigationCallbackHandler(

                telegramNavigationService,

                telegramNavigationStateService

            ),



            new OpenMainMenuCallbackHandler(

                telegramNavigationService

            ),



            new OpenMarketMenuCallbackHandler(

                telegramNavigationService

            ),



            new OpenCalculatorMenuCallbackHandler(

                telegramNavigationService

            ),



            new OpenAssistantMenuCallbackHandler(

                telegramNavigationService

            ),



            new OpenSettingsMenuCallbackHandler(

                telegramNavigationService

            ),






            /*
             * Gold Actions
             */



            new ActionCallbackHandler(

                telegramActionExecutor,

                "gold",

                "price"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "gold",

                "bubble"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "gold",

                "calculate"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "gold",

                "reverse-labor"

            ),







            /*
             * Market Actions
             */



            new ActionCallbackHandler(

                telegramActionExecutor,

                "market",

                "analytics"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "market",

                "history"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "market",

                "chart"

            ),







            /*
             * Calculator Actions
             */



            new ActionCallbackHandler(

                telegramActionExecutor,

                "calculator",

                "gold-price"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "calculator",

                "invoice"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "calculator",

                "formula"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "calculator",

                "reverse-labor"

            ),







            /*
             * Assistant Actions
             */



            new ActionCallbackHandler(

                telegramActionExecutor,

                "assistant",

                "ai"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "assistant",

                "learn"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "assistant",

                "help"

            ),







            /*
             * Settings Actions
             */



            new ActionCallbackHandler(

                telegramActionExecutor,

                "settings",

                "alerts"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "settings",

                "account"

            ),



            new ActionCallbackHandler(

                telegramActionExecutor,

                "settings",

                "bot"

            )



        ];



    }





}