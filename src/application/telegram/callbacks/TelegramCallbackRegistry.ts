import {
    TelegramCallbackRouter
}
from "./TelegramCallbackRouter";


import {
    TelegramCallbackHandlerFactory
}
from "./TelegramCallbackHandlerFactory";


import {
    GetGoldPriceUseCase
}
from "../../usecases/GetGoldPriceUseCase";


import {
    GetGoldBubbleUseCase
}
from "../../market/GetGoldBubbleUseCase";


import {
    GetMarketAnalyticsUseCase
}
from "../../market/GetMarketAnalyticsUseCase";


import {
    GetMarketHistoryUseCase
}
from "../../market/GetMarketHistoryUseCase";


import {
    MarketAnalyticsMessageFormatter
}
from "../presentation/MarketAnalyticsMessageFormatter";


import {
    MarketBubbleMessageFormatter
}
from "../presentation/MarketBubbleMessageFormatter";


import {
    TelegramNavigationService
}
from "../navigation/TelegramNavigationService";







export class TelegramCallbackRegistry {







    static create(



        getGoldPriceUseCase:

            GetGoldPriceUseCase,



        getGoldBubbleUseCase:

            GetGoldBubbleUseCase,



        getMarketAnalyticsUseCase:

            GetMarketAnalyticsUseCase,



        getMarketHistoryUseCase:

            GetMarketHistoryUseCase,



        marketAnalyticsMessageFormatter:

            MarketAnalyticsMessageFormatter,



        marketBubbleMessageFormatter:

            MarketBubbleMessageFormatter,



        telegramNavigationService:

            TelegramNavigationService



    ):

        TelegramCallbackRouter {






        const handlers =

            TelegramCallbackHandlerFactory.create(



                getGoldPriceUseCase,



                getGoldBubbleUseCase,



                getMarketAnalyticsUseCase,



                getMarketHistoryUseCase,



                marketAnalyticsMessageFormatter,



                marketBubbleMessageFormatter,



                telegramNavigationService



            );








        return new TelegramCallbackRouter(

            handlers

        );



    }







}