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

            MarketChartImageGenerator


    ):

        TelegramCallbackHandler[] {




        const actionHandlers =


            TelegramActionCatalog.getAll()

            .filter(

                action =>

                    action.id !== "market.chart"

            )

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



            ...actionHandlers


        ];


    }


}