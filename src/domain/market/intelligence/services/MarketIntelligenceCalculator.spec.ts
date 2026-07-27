import { describe, it, expect } from "vitest";

import { MarketIntelligenceCalculator }
from "./MarketIntelligenceCalculator";

import { MarketAnalytics }
from "../../analytics/entities/MarketAnalytics";

import { PercentageChange }
from "../../analytics/value-objects/PercentageChange";

import { PriceRange }
from "../../analytics/value-objects/PriceRange";

import { TrendDirection }
from "../../analytics/value-objects/TrendDirection";

import { MarketSignalType }
from "../value-objects/MarketSignal";

import { MarketRiskLevelType }
from "../value-objects/MarketRiskLevel";



function createAnalytics(

    currentPrice: number,

    previousPrice: number,

    volatility: number,

    trend: TrendDirection

): MarketAnalytics {


    return new MarketAnalytics(

        currentPrice,

        previousPrice,

        PercentageChange.create(

            previousPrice,

            currentPrice

        ),

        trend,

        volatility,

        PriceRange.create([

            previousPrice,

            currentPrice

        ]),

        new Date()

    );


}




describe(

    "MarketIntelligenceCalculator",

    () => {



        const calculator =

            new MarketIntelligenceCalculator();





        it(

            "should generate buy pressure signal for upward trend with normal bubble",

            () => {


                const analytics =

                    createAnalytics(

                        110,

                        100,

                        1,

                        TrendDirection.up()

                    );



                const bubble = {

                    intrinsicPrice: 100,

                    bubbleAmount: 1,

                    bubblePercentage: 1,

                    marketPrice: 110

                };




                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );



                expect(

                    result.getSignal().type

                )
                .toBe(

                    MarketSignalType.BUY_PRESSURE

                );


            }

        );








        it(

            "should generate sell pressure signal for downward trend",

            () => {


                const analytics =

                    createAnalytics(

                        90,

                        100,

                        1,

                        TrendDirection.down()

                    );



                const bubble = {

                    intrinsicPrice: 100,

                    bubbleAmount: 1,

                    bubblePercentage: 1,

                    marketPrice: 90

                };




                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );



                expect(

                    result.getSignal().type

                )
                .toBe(

                    MarketSignalType.SELL_PRESSURE

                );


            }

        );








        it(

            "should generate high risk for high volatility and dangerous bubble",

            () => {


                const analytics =

                    createAnalytics(

                        120,

                        100,

                        5,

                        TrendDirection.up()

                    );



                const bubble = {

                    intrinsicPrice: 100,

                    bubbleAmount: 10,

                    bubblePercentage: 10,

                    marketPrice: 120

                };




                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );



                expect(

                    result.getRiskLevel().type

                )
                .toBe(

                    MarketRiskLevelType.HIGH

                );


            }

        );








        it(

            "should wait when market trend is stable",

            () => {


                const analytics =

                    createAnalytics(

                        100,

                        100,

                        0.5,

                        TrendDirection.stable()

                    );



                const bubble = {

                    intrinsicPrice: 100,

                    bubbleAmount: 0,

                    bubblePercentage: 1,

                    marketPrice: 100

                };




                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );



                expect(

                    result.getSignal().isWait

                )
                .toBe(true);


            }

        );



    }

);