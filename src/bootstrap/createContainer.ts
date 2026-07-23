import { AppEnv }
from "../shared/config/env";


import { createStorageModule }
from "./factories/createStorageModule";


import { createCacheModule }
from "./factories/createCacheModule";


import { createMarketModule }
from "./factories/createMarketModule";


import { createGoldModule }
from "./factories/createGoldModule";


import { createTelegramModule }
from "./factories/createTelegramModule";


import { GetCurrentMarketPriceUseCase }
from "../application/market/GetCurrentMarketPriceUseCase";


import { GetGoldPriceUseCase }
from "../application/usecases/GetGoldPriceUseCase";


import { GetGoldBubbleUseCase }
from "../application/market/GetGoldBubbleUseCase";


import { GetGoldBubbleDataUseCase }
from "../application/market/GetGoldBubbleDataUseCase";


import { GetMarketAnalyticsUseCase }
from "../application/market/GetMarketAnalyticsUseCase";


import { GetMarketHistoryUseCase }
from "../application/market/GetMarketHistoryUseCase";


import { RefreshMarketPriceUseCase }
from "../application/market/RefreshMarketPriceUseCase";


import { RefreshMarketPriceJob }
from "../application/jobs/RefreshMarketPriceJob";



export function createContainer(

    env: AppEnv

) {


    const storage =
        createStorageModule(env);



    const cache =
        createCacheModule(env);



    const market =
        createMarketModule(
            env,
            storage,
            cache
        );



    const gold =
        createGoldModule();




    const currentMarketPriceUseCase =

        new GetCurrentMarketPriceUseCase(
            market.cachedMarketProvider
        );




    const getGoldPriceUseCase =

        new GetGoldPriceUseCase(
            currentMarketPriceUseCase
        );




    const getGoldBubbleUseCase =

        new GetGoldBubbleUseCase(

            market.cachedMarketProvider,

            gold.goldBubbleCalculator

        );




    const getGoldBubbleDataUseCase =

        new GetGoldBubbleDataUseCase(

            market.cachedMarketProvider,

            gold.goldBubbleCalculator

        );




    const getMarketAnalyticsUseCase =

        new GetMarketAnalyticsUseCase(

            market.analyticsService

        );




    const getMarketHistoryUseCase =

        new GetMarketHistoryUseCase(

            market.snapshotService

        );




    const refreshMarketPriceUseCase =

        new RefreshMarketPriceUseCase(

            market.priceRefreshService

        );




    const refreshMarketPriceJob =

        new RefreshMarketPriceJob(

            refreshMarketPriceUseCase

        );




    const telegram =

        createTelegramModule(

            env,

            {

                getGoldPriceUseCase,

                getGoldBubbleUseCase,

                getMarketAnalyticsUseCase,

                getMarketHistoryUseCase,

                calculateGoldFormulaUseCase:
                    gold.calculateGoldFormulaUseCase,

                sessionStore:
                    storage.sessionStore

            }

        );




    return {


        ...cache,


        ...market,


        ...gold,


        ...telegram,



        getGoldPriceUseCase,


        getGoldBubbleUseCase,


        getGoldBubbleDataUseCase,


        getMarketAnalyticsUseCase,


        getMarketHistoryUseCase,


        refreshMarketPriceUseCase,


        refreshMarketPriceJob



    };


}