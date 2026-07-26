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
    OpenMarketMenuCallbackHandler
}
from "./handlers/OpenMarketMenuCallbackHandler";


import {
    OpenCalculatorMenuCallbackHandler
}
from "./handlers/OpenCalculatorMenuCallbackHandler";


import {
    OpenAssistantMenuCallbackHandler
}
from "./handlers/OpenAssistantMenuCallbackHandler";


import {
    OpenSettingsMenuCallbackHandler
}
from "./handlers/OpenSettingsMenuCallbackHandler";


import {
    OpenMainMenuCallbackHandler
}
from "./handlers/OpenMainMenuCallbackHandler";


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
    TelegramDateFormatter
}
from "../presentation/TelegramDateFormatter";


import {
    TelegramMenuService
}
from "../menu/TelegramMenuService";


import {
    TelegramInlineKeyboardBuilder
}
from "../keyboards/TelegramInlineKeyboardBuilder";





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


        telegramMenuService:
            TelegramMenuService



    ): TelegramCallbackRouter {



        const handlers:

            TelegramCallbackHandler[] = [



                new OpenMainMenuCallbackHandler(

                    telegramMenuService,

                    new TelegramInlineKeyboardBuilder()

                ),



                new OpenMarketMenuCallbackHandler(),



                new OpenCalculatorMenuCallbackHandler(),



                new OpenAssistantMenuCallbackHandler(),



                new OpenSettingsMenuCallbackHandler(),




                new GetGoldPriceCallbackHandler(

                    getGoldPriceUseCase

                ),




                new GetGoldBubbleCallbackHandler(

                    getGoldBubbleUseCase,

                    marketBubbleMessageFormatter

                ),




                new GetMarketAnalyticsCallbackHandler(

                    getMarketAnalyticsUseCase,

                    marketAnalyticsMessageFormatter

                ),




                new GetMarketHistoryCallbackHandler(

                    getMarketHistoryUseCase,

                    new TelegramDateFormatter()

                )



            ];




        return new TelegramCallbackRouter(

            handlers

        );


    }



}