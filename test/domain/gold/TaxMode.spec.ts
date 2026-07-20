import { describe, it, expect } from "vitest";

import { createGoldRuleEngine }
from "../../../src/domain/gold/services/createGoldRuleEngine";

import { TaxMode }
from "../../../src/domain/gold/value-objects/Tax";



describe(
    "Gold Tax Modes",
    () => {


        it(
            "should calculate separate tax",
            () => {


                const engine =
                    createGoldRuleEngine();



                const result =
                    engine.execute({

                        weight: 5,

                        goldPrice: 18000000,

                        laborPercent: 15,

                        profitPercent: 7,

                        taxPercent: 9,

                        taxMode:
                            TaxMode.SEPARATE,

                        discount: 0

                    });



                expect(
                    result.tax
                )
                .toBeGreaterThan(0);


            }
        );



        it(
            "should calculate without tax",
            () => {


                const engine =
                    createGoldRuleEngine();



                const result =
                    engine.execute({

                        weight: 5,

                        goldPrice: 18000000,

                        laborPercent: 15,

                        profitPercent: 7,

                        taxPercent: 9,

                        taxMode:
                            TaxMode.NONE,

                        discount: 0

                    });



                expect(
                    result.tax
                )
                .toBe(0);


            }
        );



        it(
            "should not add separate tax when included in labor",
            () => {


                const engine =
                    createGoldRuleEngine();



                const result =
                    engine.execute({

                        weight: 5,

                        goldPrice: 18000000,

                        laborPercent: 15,

                        profitPercent: 7,

                        taxPercent: 9,

                        taxMode:
                            TaxMode.INCLUDED_IN_LABOR,

                        discount: 0

                    });



                expect(
                    result.tax
                )
                .toBe(0);


            }
        );


    }
);