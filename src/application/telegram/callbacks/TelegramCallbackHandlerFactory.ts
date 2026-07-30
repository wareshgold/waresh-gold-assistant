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
             * Navigation callbacks
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
             * Action Engine callbacks
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



        ];


    }



}