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


        goldCalculationWorkflow:
            GoldCalculationWorkflow,


        numberFormatter:
            TelegramNumberFormatter,


        goldPriceResolver:
            GoldPriceResolver



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


                goldCalculationWorkflow,


                numberFormatter,


                goldPriceResolver



            );






        return new TelegramCallbackRouter(

            handlers

        );


    }


}