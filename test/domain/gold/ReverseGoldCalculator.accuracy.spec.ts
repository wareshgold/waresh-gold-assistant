import { describe, it, expect } from "vitest";

import { ReverseGoldCalculator } 
from "../../../src/domain/gold/calculator/ReverseGoldCalculator";

import { createGoldRuleEngine }
from "../../../src/domain/gold/services/createGoldRuleEngine";



describe(
    "Reverse Gold Calculator Accuracy",
    () => {


        it(
            "should restore gold price from calculated final price",
            () => {


                const engine =
                    createGoldRuleEngine();


                const reverse =
                    new ReverseGoldCalculator();



                const originalGoldPrice =
                    18000000;



                const weight =
                    5;



                const forward =
                    engine.execute({

                        weight,

                        goldPrice:
                            originalGoldPrice,

                        laborPercent:
                            15,

                        profitPercent:
                            7,

                        taxPercent:
                            10

                    });



                const backward =
                    reverse.calculate({

                        target:
                            "GOLD_PRICE",

                        weight,

                        finalPrice:
                            forward.finalPrice,

                        laborPercent:
                            15,

                        profitPercent:
                            7,

                        taxPercent:
                            10

                    });



                expect(
                    backward.goldPrice
                )
                .toBe(
                    originalGoldPrice
                );


            }
        );



        it(
            "should restore weight from calculated final price",
            () => {


                const engine =
                    createGoldRuleEngine();


                const reverse =
                    new ReverseGoldCalculator();



                const originalWeight =
                    5;



                const goldPrice =
                    18000000;



                const forward =
                    engine.execute({

                        weight:
                            originalWeight,

                        goldPrice,

                        laborPercent:
                            15,

                        profitPercent:
                            7,

                        taxPercent:
                            10

                    });



                const backward =
                    reverse.calculate({

                        target:
                            "WEIGHT",

                        goldPrice,

                        finalPrice:
                            forward.finalPrice,

                        laborPercent:
                            15,

                        profitPercent:
                            7,

                        taxPercent:
                            10

                    });



                expect(
                    backward.weight
                )
                .toBeCloseTo(
                    originalWeight,
                    2
                );


            }
        );


    }
);