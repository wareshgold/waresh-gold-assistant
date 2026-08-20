import {
    AppEnv
} from "../../shared/config/env";


import {
    SP2LStrategyService
} from "../../application/strategy/sp2l/SP2LStrategyService";


import {
    CollectOunceTickUseCase
} from "../../application/sp2l/CollectOunceTickUseCase";


import {
    CollectOunceTickJob
} from "../../application/jobs/CollectOunceTickJob";


import {
    OunceCandleAggregator
} from "../../domain/sp2l/services/OunceCandleAggregator";


import {
    SP2LSignalEngine
} from "../../domain/sp2l/services/SP2LSignalEngine";


import {
    TelegramOunceMessageProvider
} from "../../infrastructure/sp2l/TelegramOunceMessageProvider";


import {
    TelegramSp2lMarketDataProvider
} from "../../infrastructure/sp2l/TelegramSp2lMarketDataProvider";


import {
    MemoryOunceTickRepository
} from "../../infrastructure/sp2l/MemoryOunceTickRepository";


import {
    D1OunceTickRepository
} from "../../infrastructure/sp2l/D1OunceTickRepository";


import {
    MemorySP2LSignalRepository
} from "../../infrastructure/sp2l/MemorySP2LSignalRepository";


import {
    OunceTickRepository
} from "../../domain/sp2l/repositories/OunceTickRepository";





export function createSp2lModule(

    env: AppEnv

) {



    const tickRepository:

        OunceTickRepository =

        env.waresh_gold_db

            ?

            new D1OunceTickRepository(

                env.waresh_gold_db

            )

            :

            new MemoryOunceTickRepository();







    const ounceMessageProvider =

        new TelegramOunceMessageProvider(

            "https://t.me/s/gheymatOunce"

        );







    const marketDataProvider =

        new TelegramSp2lMarketDataProvider(

            ounceMessageProvider,

            tickRepository,

            new OunceCandleAggregator(

                5

            )

        );







    const signalRepository =

        new MemorySP2LSignalRepository();







    const strategyService =

        new SP2LStrategyService(

            new SP2LSignalEngine(),

            marketDataProvider,

            signalRepository

        );







    const collectOunceTickUseCase =

        new CollectOunceTickUseCase(

            ounceMessageProvider,

            tickRepository

        );







    const collectOunceTickJob =

        new CollectOunceTickJob(

            collectOunceTickUseCase

        );







    return {


        tickRepository,


        ounceMessageProvider,


        marketDataProvider,


        strategyService,


        collectOunceTickUseCase,


        collectOunceTickJob


    };

}