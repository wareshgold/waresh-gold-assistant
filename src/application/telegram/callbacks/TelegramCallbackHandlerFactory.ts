import {
    TelegramCallbackHandler
}
from "./TelegramCallbackHandler";


import {
    GetGoldPriceCallbackHandler
}
from "./handlers/GetGoldPriceCallbackHandler";


import {
    CopyGoldPriceCallbackHandler
}
from "./handlers/CopyGoldPriceCallbackHandler";


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
    BackNavigationCallbackHandler
}
from "./handlers/BackNavigationCallbackHandler";


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
    TelegramNavigationService
}
from "../navigation/TelegramNavigationService";


import {
    TelegramNavigationStateService
}
from "../navigation/TelegramNavigationStateService";







export class TelegramCallbackHandlerFactory {







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

            TelegramNavigationService,



        telegramNavigationStateService:

            TelegramNavigationStateService



    ):

        TelegramCallbackHandler[] {





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



            new GetGoldPriceCallbackHandler(

                getGoldPriceUseCase,

                telegramNavigationService

            ),



            new CopyGoldPriceCallbackHandler(

                getGoldPriceUseCase,

                telegramNavigationService

            ),



            new GetGoldBubbleCallbackHandler(

                getGoldBubbleUseCase,

                marketBubbleMessageFormatter,

                telegramNavigationService

            ),



            new GetMarketAnalyticsCallbackHandler(

                getMarketAnalyticsUseCase,

                marketAnalyticsMessageFormatter,

                telegramNavigationService

            ),



            new GetMarketHistoryCallbackHandler(

                getMarketHistoryUseCase,

                new TelegramDateFormatter(),

                telegramNavigationService

            )


        ];



    }




}