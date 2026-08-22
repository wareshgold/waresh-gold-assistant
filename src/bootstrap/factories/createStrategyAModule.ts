import {
    AppEnv
} from "../../shared/config/env";

import {
    StrategyAStrategyService
} from "../../application/strategy/strategy-a/StrategyAStrategyService";

import {
    CollectOunceTickUseCase
} from "../../application/strategy-a/CollectOunceTickUseCase";

import {
    CollectOunceTickJob
} from "../../application/jobs/CollectOunceTickJob";

import {
    OunceCandleAggregator
} from "../../domain/strategy-a/services/OunceCandleAggregator";

import {
    StrategyASignalEngine
} from "../../domain/strategy-a/services/StrategyASignalEngine";

import {
    TelegramOunceMessageProvider
} from "../../infrastructure/strategy-a/TelegramOunceMessageProvider";

import {
    TelegramStrategyAMarketDataProvider
} from "../../infrastructure/strategy-a/TelegramStrategyAMarketDataProvider";

import {
    MemoryOunceTickRepository
} from "../../infrastructure/strategy-a/MemoryOunceTickRepository";

import {
    D1OunceTickRepository
} from "../../infrastructure/strategy-a/D1OunceTickRepository";

import {
    MemoryStrategyASignalRepository
} from "../../infrastructure/strategy-a/MemoryStrategyASignalRepository";

import {
    D1StrategyASignalRepository
} from "../../infrastructure/strategy-a/D1StrategyASignalRepository";

import {
    OunceTickRepository
} from "../../domain/strategy-a/repositories/OunceTickRepository";

import {
    StrategyASignalRepository
} from "../../domain/strategy-a/repositories/StrategyASignalRepository";

export function createStrategyAModule(
    env: AppEnv
) {
    const tickRepository:
        OunceTickRepository =
        env.waresh_gold_db
            ? new D1OunceTickRepository(
                env.waresh_gold_db
            )
            : new MemoryOunceTickRepository();

    const ounceMessageProvider =
        new TelegramOunceMessageProvider(
            "https://t.me/s/OunceMarkets"
        );

    const marketDataProvider =
        new TelegramStrategyAMarketDataProvider(
            tickRepository,
            new OunceCandleAggregator(5)
        );

    const signalRepository:
        StrategyASignalRepository =
        env.waresh_gold_db
            ? new D1StrategyASignalRepository(
                env.waresh_gold_db
            )
            : new MemoryStrategyASignalRepository();

    const strategyService =
        new StrategyAStrategyService(
            new StrategyASignalEngine(),
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
        signalRepository,
        strategyService,
        collectOunceTickUseCase,
        collectOunceTickJob
    };
}