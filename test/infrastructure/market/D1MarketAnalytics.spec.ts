import { describe, expect, it } from "vitest";


import { D1MarketSnapshotRepository }
from "../../../src/infrastructure/market/repositories/d1/D1MarketSnapshotRepository";


import { MarketSnapshot }
from "../../../src/domain/market/snapshots/MarketSnapshot";


import { MarketAnalyticsService }
from "../../../src/application/market/services/MarketAnalyticsService";


import { MarketAnalyticsFacade }
from "../../../src/application/market/services/MarketAnalyticsFacade";


import { MarketScoreCalculator }
from "../../../src/domain/market/analytics/services/MarketScoreCalculator";


import { GetMarketAnalyticsUseCase }
from "../../../src/application/market/GetMarketAnalyticsUseCase";


import { TrendCalculator }
from "../../../src/domain/market/analytics/services/TrendCalculator";


import { VolatilityCalculator }
from "../../../src/domain/market/analytics/services/VolatilityCalculator";




class FakeD1Database {


    private rows: any[] = [];



    prepare(
        query: string
    ) {


        const sortedRows = () => {

            return this.rows.sort(

                (a, b) =>

                    new Date(b.captured_at).getTime()
                    -
                    new Date(a.captured_at).getTime()

            );

        };



        return {


            bind: (...values: any[]) => {


                return {


                    run: async () => {


                        if (
                            query.includes("INSERT INTO")
                        ) {


                            this.rows.push({

                                gold18_price: values[0],

                                currency_price: values[1],

                                ounce_price: values[2],

                                source: values[3],

                                captured_at: values[4],

                                created_at: values[5]

                            });

                        }


                    },



                    all: async () => {


                        return {

                            results:

                                sortedRows()

                        };


                    }


                };


            },



            first: async () => {


                return sortedRows()[0] ?? null;


            }


        };


    }


}







describe(
    "D1 Market Analytics Flow",
    () => {



        it(
            "should calculate analytics from D1 snapshots",
            async () => {



                const db =

                    new FakeD1Database();





                const repository =

                    new D1MarketSnapshotRepository(

                        db as unknown as D1Database

                    );





                await repository.save(

                    new MarketSnapshot(

                        18000000,

                        190000,

                        4000,

                        new Date("2026-07-20"),

                        "source-1"

                    )

                );





                await repository.save(

                    new MarketSnapshot(

                        18600000,

                        191000,

                        4010,

                        new Date("2026-07-21"),

                        "source-2"

                    )

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

                    result.analytics

                    ?.getCurrentPrice()

                )

                .toBe(

                    18600000

                );





                expect(

                    result.analytics

                    ?.getChange()

                    .isPositive

                )

                .toBe(

                    true

                );





                expect(

                    result.analytics

                    ?.getPriceRange()

                    .min

                )

                .toBe(

                    18000000

                );





                expect(

                    result.analytics

                    ?.getPriceRange()

                    .max

                )

                .toBe(

                    18600000

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