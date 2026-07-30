import {
    TelegramCallbackRouter,
}
from "./TelegramCallbackRouter";


import {
    TelegramCallbackHandlerFactory,
}
from "./TelegramCallbackHandlerFactory";


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





export class TelegramCallbackRegistry {






    static create(



        telegramActionExecutor:

            TelegramActionExecutor,



        telegramNavigationService:

            TelegramNavigationService,



        telegramNavigationStateService:

            TelegramNavigationStateService



    ):

        TelegramCallbackRouter {






        const handlers =



            TelegramCallbackHandlerFactory.create(



                telegramActionExecutor,



                telegramNavigationService,



                telegramNavigationStateService



            );








        return new TelegramCallbackRouter(

            handlers

        );



    }







}