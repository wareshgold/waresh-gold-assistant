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
    TelegramActionCatalog,
}
from "../actions/TelegramActionCatalog";


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




        const actionHandlers =


            TelegramActionCatalog.getAll()

            .map(

                action =>

                    new ActionCallbackHandler(

                        telegramActionExecutor,

                        action.id

                    )

            );






        return [



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



            ...actionHandlers



        ];



    }



}