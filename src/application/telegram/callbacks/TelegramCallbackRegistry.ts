import {
    TelegramCallbackRouter
}
from "./TelegramCallbackRouter";


import {
    TelegramCallbackHandler
}
from "./TelegramCallbackHandler";


import {
    GetGoldPriceCallbackHandler
}
from "./handlers/GetGoldPriceCallbackHandler";


import {
    GetGoldBubbleCallbackHandler
}
from "./handlers/GetGoldBubbleCallbackHandler";


import {
    GetMarketAnalyticsCallbackHandler
}
from "./handlers/GetMarketAnalyticsCallbackHandler";


import {
    GetMarketHistoryCallbackHandler
}
from "./handlers/GetMarketHistoryCallbackHandler";


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
            MarketAnalyticsMessageFormatter



    ): TelegramCallbackRouter {





        const handlers:

            TelegramCallbackHandler[] = [





                new GetGoldPriceCallbackHandler(

                    getGoldPriceUseCase

                ),





                new GetGoldBubbleCallbackHandler(

                    getGoldBubbleUseCase

                ),





                new GetMarketAnalyticsCallbackHandler(

                    getMarketAnalyticsUseCase,


                    marketAnalyticsMessageFormatter

                ),





                new GetMarketHistoryCallbackHandler(

                    getMarketHistoryUseCase

                )



            ];







        return new TelegramCallbackRouter(

            handlers

        );


    }



}