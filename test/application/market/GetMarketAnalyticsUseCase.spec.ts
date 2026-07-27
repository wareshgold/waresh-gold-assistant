import { describe, expect, it } from "vitest";


import { GetMarketAnalyticsUseCase }
from "../../../src/application/market/GetMarketAnalyticsUseCase";


import { MarketAnalyticsService }
from "../../../src/application/market/services/MarketAnalyticsService";


import { MarketAnalyticsFacade }
from "../../../src/application/market/services/MarketAnalyticsFacade";


import { MarketScoreCalculator }
from "../../../src/domain/market/analytics/services/MarketScoreCalculator";


import { MemoryMarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/MemoryMarketSnapshotRepository";


import { MarketSnapshotService }
from "../../../src/application/market/services/MarketSnapshotService";


import { TrendCalculator }
from "../../../src/domain/market/analytics/services/TrendCalculator";


import { VolatilityCalculator }
from "../../../src/domain/market/analytics/services/VolatilityCalculator";


import { MarketPrice }
from "../../../src/domain/market/entities/MarketPrice";




describe(
    "GetMarketAnalyticsUseCase",
    () => {



        it(
            "should return market analytics",
            async () => {



                const repository =

                    new MemoryMarketSnapshotRepository();




                const snapshotService =

                    new MarketSnapshotService(

                        repository

                    );




                await snapshotService.savePrice(

                    new MarketPrice(

                        18000000,

                        190000,

                        4000,

                        new Date()

                    ),

                    "test"

                );





                await snapshotService.savePrice(

                    new MarketPrice(

                        18500000,

                        191000,

                        4010,

                        new Date()

                    ),

                    "test"

                );





                const analyticsService =

                    new MarketAnalyticsService(

                        repository,

                        new TrendCalculator(),

                        new VolatilityCalculator()

                    );





                const facade =

                    new MarketAnalyticsFacade(

                        analyticsService,

                        new MarketScoreCalculator()

                    );





                const useCase =

                    new GetMarketAnalyticsUseCase(

                        facade

                    );





                const result =

                    await useCase.execute();





                expect(

                    result.analytics

                )

                .not

                .toBeNull();





                expect(

                    result.analytics?.getCurrentPrice()

                )

                .toBe(

                    18500000

                );





                expect(

                    result.analytics?.getChange().isPositive

                )

                .toBe(

                    true

                );



                expect(

                    result.score

                )

                .not

                .toBeNull();



            }

        );



    }

);