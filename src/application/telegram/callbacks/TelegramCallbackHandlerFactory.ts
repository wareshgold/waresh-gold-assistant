
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
from "./handlers/OpenAssistantMenuCallbackHandler";import {
    OpenSettingsMenuCallbackHandler,
} from "./handlers/OpenSettingsMenuCallbackHandler";

import {
    OpenStrategyMenuCallbackHandler,
} from "./handlers/OpenStrategyMenuCallbackHandler";

import {
    OpenAlertsMenuCallbackHandler,
} from "./handlers/OpenAlertsMenuCallbackHandler";


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
    CalculateGoldManualPriceCallbackHandler,
}
from "./handlers/CalculateGoldManualPriceCallbackHandler";


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
    GoldCalculationWorkflow,
}
from "../../gold/workflows/GoldCalculationWorkflow";


import {
    TelegramNumberFormatter,
}
from "../presentation/TelegramNumberFormatter";


import {
    GoldPriceResolver,
}
from "../../gold/pricing/GoldPriceResolver";

import {
    BubbleAlertService,
}
from "../../bubble-alert/BubbleAlertService";

import {
    GoldPriceAlertService,
}
from "../../gold-alert/GoldPriceAlertService";

import {
    PriceTargetAlertService,
}
from "../../price-target-alert/PriceTargetAlertService";

import {
    BubbleThresholdCallbackHandler,
}
from "./handlers/BubbleThresholdCallbackHandler";

import {
    AlertIntervalCallbackHandler,
}
from "./handlers/AlertIntervalCallbackHandler";

import {
    PriceTargetCallbackHandler,
}
from "./handlers/PriceTargetCallbackHandler";

import {
    PriceTargetActionCallbackHandler,
} from "./handlers/PriceTargetActionCallbackHandler";

import {
    AboutBotCallbackHandler,
}
from "./handlers/AboutBotCallbackHandler";



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


        goldCalculationWorkflow:
            GoldCalculationWorkflow,


        numberFormatter:
            TelegramNumberFormatter,        goldPriceResolver:
            GoldPriceResolver,


        bubbleAlertService:
            BubbleAlertService,


        alertService:
            GoldPriceAlertService,

        priceTargetAlertService:
            PriceTargetAlertService



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

            ),            new OpenAssistantMenuCallbackHandler(
                telegramNavigationService
            ),



            new OpenStrategyMenuCallbackHandler(
                telegramNavigationService
            ),



            new OpenAlertsMenuCallbackHandler(
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



            new CalculateGoldLivePriceCallbackHandler(

                sessionStore,

                goldPriceResolver,

                goldCalculationWorkflow,

                numberFormatter

            ),



            new CalculateGoldManualPriceCallbackHandler(

                sessionStore,

                goldCalculationWorkflow

            ),            new BackCalculationCallbackHandler(
                sessionStore,
                goldCalculationWorkflow
            ),

            new AboutBotCallbackHandler(),

            new BubbleThresholdCallbackHandler(
                bubbleAlertService
            ),

            new AlertIntervalCallbackHandler(
                alertService
            ),

            new PriceTargetCallbackHandler(
                priceTargetAlertService
            ),

            new PriceTargetActionCallbackHandler(
                sessionStore
            ),

            ...actionHandlers



        ];



    }


}