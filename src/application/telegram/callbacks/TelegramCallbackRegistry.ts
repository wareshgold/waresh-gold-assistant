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
    GetMarketChartUseCase
}
from "../../market/GetMarketChartUseCase";


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


import {
    TelegramNavigationStateService
}
from "../navigation/TelegramNavigationStateService";







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







        getMarketChartUseCase:

            GetMarketChartUseCase,







        marketAnalyticsMessageFormatter:

            MarketAnalyticsMessageFormatter,







        marketBubbleMessageFormatter:

            MarketBubbleMessageFormatter,







        telegramNavigationService:

            TelegramNavigationService,







        telegramNavigationStateService:

            TelegramNavigationStateService,







        sessionStore:

            any







    ):

        TelegramCallbackRouter {









        const handlers =



            TelegramCallbackHandlerFactory.create(







                getGoldPriceUseCase,







                getGoldBubbleUseCase,







                getMarketAnalyticsUseCase,







                getMarketHistoryUseCase,







                getMarketChartUseCase,







                marketAnalyticsMessageFormatter,







                marketBubbleMessageFormatter,







                telegramNavigationService,







                telegramNavigationStateService,







                sessionStore







            );











        return new TelegramCallbackRouter(



            handlers



        );





    }







}