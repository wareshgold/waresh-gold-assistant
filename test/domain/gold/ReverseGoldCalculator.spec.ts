import { describe, it, expect } from "vitest";

import { ReverseGoldCalculator } from "../../../src/domain/gold/calculator/ReverseGoldCalculator";


describe(
    "Reverse Gold Calculator",
    () => {


        it(
            "should calculate gold price from final price",
            () => {


                const calculator =
                    new ReverseGoldCalculator();



                const result =
                    calculator.calculate({

                        target:
                            "GOLD_PRICE",

                        weight:
                            5,

                        finalPrice:
                            100000000,

                        laborPercent:
                            15,

                        profitPercent:
                            7,

                        taxPercent:
                            0

                    });



                expect(
                    result.goldPrice
                )
                .toBeDefined();



                expect(
                    result.goldPrice
                )
                .toBeGreaterThan(0);


            }
        );



        it(
            "should calculate weight from final price",
            () => {


                const calculator =
                    new ReverseGoldCalculator();



                const result =
                    calculator.calculate({

                        target:
                            "WEIGHT",

                        goldPrice:
                            18000000,

                        finalPrice:
                            100000000,

                        laborPercent:
                            15,

                        profitPercent:
                            7,

                        taxPercent:
                            0

                    });



                expect(
                    result.weight
                )
                .toBeDefined();



                expect(
                    result.weight
                )
                .toBeGreaterThan(0);


            }
        );


    }
);