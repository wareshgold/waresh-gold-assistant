import { describe, it, expect } from "vitest";

import { MarketIntelligenceCalculator }
from "../../../src/domain/market/intelligence/services/MarketIntelligenceCalculator";

import { MarketAnalytics }
from "../../../src/domain/market/analytics/entities/MarketAnalytics";

import { PercentageChange }
from "../../../src/domain/market/analytics/value-objects/PercentageChange";

import { PriceRange }
from "../../../src/domain/market/analytics/value-objects/PriceRange";

import { TrendDirection }
from "../../../src/domain/market/analytics/value-objects/TrendDirection";

import { GoldBubbleResult }
from "../../../src/domain/market/services/GoldBubbleCalculator";





describe(

    "MarketIntelligenceCalculator",

    () => {



        const calculator =

            new MarketIntelligenceCalculator();







        it(

            "should create low risk intelligence",

            () => {



                const analytics =

                    new MarketAnalytics(

                        100,

                        99,

                        PercentageChange.create(

                            99,

                            100

                        ),

                        TrendDirection.stable(),

                        0.5,

                        PriceRange.create(

                            [

                                99,

                                100

                            ]

                        ),

                        new Date()

                    );





                const bubble:

                    GoldBubbleResult = {


                    intrinsicPrice: 100,


                    bubbleAmount: 1,


                    bubblePercentage: 1,


                    marketPrice: 101


                };





                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );





                expect(

                    result
                        .getRiskLevel()
                        .isLow

                )
                .toBe(true);





                expect(

                    result
                        .getBubbleStatus()
                        .isNormal

                )
                .toBe(true);



            }

        );









        it(

            "should create high risk intelligence",

            () => {



                const analytics =

                    new MarketAnalytics(

                        120,

                        100,

                        PercentageChange.create(

                            100,

                            120

                        ),

                        TrendDirection.up(),

                        5,

                        PriceRange.create(

                            [

                                100,

                                120

                            ]

                        ),

                        new Date()

                    );





                const bubble:

                    GoldBubbleResult = {


                    intrinsicPrice: 100,


                    bubbleAmount: 10,


                    bubblePercentage: 10,


                    marketPrice: 110


                };





                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );





                expect(

                    result
                        .getRiskLevel()
                        .isHigh

                )
                .toBe(true);





                expect(

                    result
                        .getBubbleStatus()
                        .isDangerous

                )
                .toBe(true);





                expect(

                    result
                        .getSignal()
                        .isWait

                )
                .toBe(true);



            }

        );









        it(

            "should create buy pressure signal",

            () => {



                const analytics =

                    new MarketAnalytics(

                        105,

                        100,

                        PercentageChange.create(

                            100,

                            105

                        ),

                        TrendDirection.up(),

                        0.5,

                        PriceRange.create(

                            [

                                100,

                                105

                            ]

                        ),

                        new Date()

                    );





                const bubble:

                    GoldBubbleResult = {


                    intrinsicPrice: 100,


                    bubbleAmount: 1,


                    bubblePercentage: 1,


                    marketPrice: 101


                };





                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );





                expect(

                    result
                        .getSignal()
                        .isBuyPressure

                )
                .toBe(true);



            }

        );









        it(

            "should create sell pressure signal",

            () => {



                const analytics =

                    new MarketAnalytics(

                        95,

                        100,

                        PercentageChange.create(

                            100,

                            95

                        ),

                        TrendDirection.down(),

                        2,

                        PriceRange.create(

                            [

                                95,

                                100

                            ]

                        ),

                        new Date()

                    );





                const bubble:

                    GoldBubbleResult = {


                    intrinsicPrice: 100,


                    bubbleAmount: 1,


                    bubblePercentage: 1,


                    marketPrice: 101


                };





                const result =

                    calculator.calculate(

                        analytics,

                        bubble

                    );





                expect(

                    result
                        .getSignal()
                        .isSellPressure

                )
                .toBe(true);



            }

        );






    }

);