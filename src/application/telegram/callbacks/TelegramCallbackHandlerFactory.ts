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
    GetMarketChartCallbackHandler,
}
from "./handlers/GetMarketChartCallbackHandler";


import {
    CalculateGoldCallbackHandler,
}
from "./handlers/CalculateGoldCallbackHandler";


import {
    CalculateGoldLivePriceCallbackHandler,
}
from "./handlers/CalculateGoldLivePriceCallbackHandler";


import {
    CalculateGoldPriceCallbackHandler,
}
from "./handlers/CalculateGoldPriceCallbackHandler";


import {
    BackCalculationCallbackHandler,
}
from "./handlers/BackCalculationCallbackHandler";


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


import {
    GoldCalculationWorkflow,
}
from "../../gold/workflows/GoldCalculationWorkflow";


import {
    TelegramNumberFormatter
}
from "../presentation/TelegramNumberFormatter";







export class TelegramCallbackHandlerFactory {



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
            GetCurrentGoldPriceUseCase,


        goldCalculationWorkflow:
            GoldCalculationWorkflow,


        numberFormatter:
            TelegramNumberFormatter



    ):
        TelegramCallbackHandler[] {





        const actionHandlers =

            TelegramActionCatalog

                .getCallbackActions()

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





            new GetMarketChartCallbackHandler(

                getMarketChartUseCase,

                marketChartRenderer,

                marketChartImageGenerator,

                telegramNavigationService

            ),





            new CalculateGoldCallbackHandler(

                sessionStore

            ),





            new CalculateGoldPriceCallbackHandler(

                sessionStore,

                getCurrentGoldPriceUseCase,

                goldCalculationWorkflow,

                numberFormatter

            ),





            new CalculateGoldLivePriceCallbackHandler(

                sessionStore,

                getCurrentGoldPriceUseCase,

                goldCalculationWorkflow,

                numberFormatter

            ),





            new BackCalculationCallbackHandler(

                sessionStore,

                goldCalculationWorkflow

            ),





            ...actionHandlers



        ];


    }



}