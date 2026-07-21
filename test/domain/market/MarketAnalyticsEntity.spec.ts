import { describe, expect, it } from "vitest";

import { MarketAnalytics }
from "../../../src/domain/market/analytics/entities/MarketAnalytics";

import { PercentageChange }
from "../../../src/domain/market/analytics/value-objects/PercentageChange";

import { TrendDirection }
from "../../../src/domain/market/analytics/value-objects/TrendDirection";

import { PriceRange }
from "../../../src/domain/market/analytics/value-objects/PriceRange";


describe(
    "Market Analytics Entity",
    () => {


        it(
            "should create valid market analytics",
            () => {


                const analytics =
                    new MarketAnalytics(

                        18500000,

                        18000000,

                        PercentageChange.create(
                            18000000,
                            18500000
                        ),

                        TrendDirection.up(),

                        1.5,

                        PriceRange.create(
                            [
                                18000000,
                                18500000,
                                18300000
                            ]
                        ),

                        new Date()

                    );


                expect(
                    analytics.getCurrentPrice()
                )
                .toBe(18500000);


                expect(
                    analytics.getPreviousPrice()
                )
                .toBe(18000000);


                expect(
                    analytics.getTrend().isUp
                )
                .toBe(true);


            }
        );



        it(
            "should reject invalid current price",
            () => {


                expect(
                    () =>
                    new MarketAnalytics(

                        0,

                        18000000,

                        PercentageChange.create(
                            18000000,
                            18500000
                        ),

                        TrendDirection.up(),

                        1.5,

                        PriceRange.create(
                            [
                                18000000,
                                18500000
                            ]
                        ),

                        new Date()

                    )
                )
                .toThrow();


            }
        );



    }
);