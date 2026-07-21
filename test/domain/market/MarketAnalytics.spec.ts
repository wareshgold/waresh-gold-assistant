import { describe, expect, it } from "vitest";

import { TrendCalculator }
from "../../../src/domain/market/analytics/services/TrendCalculator";

import { VolatilityCalculator }
from "../../../src/domain/market/analytics/services/VolatilityCalculator";

import { TrendDirectionType }
from "../../../src/domain/market/analytics/value-objects/TrendDirection";

import { PercentageChange }
from "../../../src/domain/market/analytics/value-objects/PercentageChange";



describe(
    "Market Analytics Domain",
    () => {



        it(
            "should calculate percentage change correctly",
            () => {


                const change =
                    PercentageChange.create(
                        10000000,
                        10500000
                    );



                expect(
                    change.value
                )
                .toBeCloseTo(
                    5
                );


                expect(
                    change.isPositive
                )
                .toBe(true);


            }
        );





        it(
            "should detect upward trend",
            () => {


                const calculator =
                    new TrendCalculator();



                const trend =
                    calculator.calculate(

                        110,

                        100

                    );



                expect(
                    trend.type
                )
                .toBe(
                    TrendDirectionType.UP
                );


            }
        );





        it(
            "should calculate volatility",
            () => {


                const calculator =
                    new VolatilityCalculator();



                const volatility =
                    calculator.calculate(

                        [
                            100,

                            110,

                            105

                        ]

                    );



                expect(
                    volatility
                )
                .toBeGreaterThan(0);



            }
        );



    }
);