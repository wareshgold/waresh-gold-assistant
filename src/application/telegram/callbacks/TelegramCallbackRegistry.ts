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


import {
    GetMarketChartUseCase,
}
from "../../market/GetMarketChartUseCase";


import {
    MarketChartRenderer,
}
from "../../market/chart/MarketChartRenderer";


import {
    MarketChartImageGenerator,
}
from "../../../infrastructure/chart/MarketChartImageGenerator";


import {
    TelegramSessionStore,
}
from "../state/TelegramSessionStore";


import {
    GetCurrentGoldPriceUseCase,
}
from "../../gold/GetCurrentGoldPriceUseCase";







export class TelegramCallbackRegistry {







    static create(



        telegramActionExecutor:

            TelegramActionExecutor,



        telegramNavigationService:

            TelegramNavigationService,



        telegramNavigationStateService:

            TelegramNavigationStateService,



        getMarketChartUseCase:

            GetMarketChartUseCase,



        marketChartRenderer:

            MarketChartRenderer,



        marketChartImageGenerator:

            MarketChartImageGenerator,



        sessionStore:

            TelegramSessionStore,



        getCurrentGoldPriceUseCase:

            GetCurrentGoldPriceUseCase



    ):

        TelegramCallbackRouter {






        const handlers =



            TelegramCallbackHandlerFactory.create(



                telegramActionExecutor,



                telegramNavigationService,



                telegramNavigationStateService,



                getMarketChartUseCase,



                marketChartRenderer,



                marketChartImageGenerator,



                sessionStore,



                getCurrentGoldPriceUseCase



            );







        return new TelegramCallbackRouter(

            handlers

        );



    }



}