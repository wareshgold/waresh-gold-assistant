import { describe, it, expect } from "vitest";

import { MarketAnalyticsService } from "./MarketAnalyticsService";

import { MarketSnapshotRepository } 
from "../../../domain/market/repositories/MarketSnapshotRepository";

import { MarketSnapshot }
from "../../../domain/market/snapshots/MarketSnapshot";

import { TrendCalculator }
from "../../../domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../../../domain/market/analytics/services/VolatilityCalculator";



class FakeMarketSnapshotRepository

implements MarketSnapshotRepository {


    constructor(

        private readonly snapshots:
            MarketSnapshot[]

    ) {}



    async save(
        snapshot: MarketSnapshot
    ): Promise<void> {

        this.snapshots.push(snapshot);

    }



    async getLatest():
        Promise<MarketSnapshot | null> {

        return this.snapshots[0] ?? null;

    }



    async getHistory(
        limit?: number
    ):
        Promise<MarketSnapshot[]> {

        return limit

            ? this.snapshots.slice(0, limit)

            : this.snapshots;

    }

}





function createSnapshot(
    price: number
): MarketSnapshot {


    return new MarketSnapshot(

        price,

        180000,

        3000,

        new Date(),

        "test"

    );

}





describe(

    "MarketAnalyticsService",

    () => {



        it(

            "should detect upward market trend",

            async () => {


                const repository =

                    new FakeMarketSnapshotRepository([

                        createSnapshot(110),

                        createSnapshot(105),

                        createSnapshot(100)

                    ]);



                const service =

                    new MarketAnalyticsService(

                        repository,

                        new TrendCalculator(),

                        new VolatilityCalculator()

                    );



                const result =

                    await service.analyze();



                expect(result)
                    .not
                    .toBeNull();



                expect(
                    result!.getCurrentPrice()
                )
                    .toBe(110);



                expect(
                    result!.getTrend().type
                )
                    .toBe("UP");


            }

        );






        it(

            "should detect downward market trend",

            async () => {


                const repository =

                    new FakeMarketSnapshotRepository([

                        createSnapshot(100),

                        createSnapshot(105),

                        createSnapshot(110)

                    ]);



                const service =

                    new MarketAnalyticsService(

                        repository,

                        new TrendCalculator(),

                        new VolatilityCalculator()

                    );



                const result =

                    await service.analyze();



                expect(
                    result!.getTrend().type
                )
                    .toBe("DOWN");


            }

        );







        it(

            "should return null when history is insufficient",

            async () => {


                const repository =

                    new FakeMarketSnapshotRepository([

                        createSnapshot(100)

                    ]);



                const service =

                    new MarketAnalyticsService(

                        repository,

                        new TrendCalculator(),

                        new VolatilityCalculator()

                    );



                const result =

                    await service.analyze();



                expect(result)
                    .toBeNull();


            }

        );






    }

);