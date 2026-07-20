import { describe, it, expect } from "vitest";

import {
    CalculateReverseGoldUseCase
} from "../../../src/application/gold/CalculateReverseGoldUseCase";

import {
    ReverseGoldCalculator
} from "../../../src/domain/gold/calculator/ReverseGoldCalculator";



describe(
    "Calculate Reverse Gold Use Case",
    () => {


        it(
            "should calculate reverse gold price",
            () => {


                const useCase =
                    new CalculateReverseGoldUseCase(
                        new ReverseGoldCalculator()
                    );



                const result =
                    useCase.execute({

                        target:
                            "GOLD_PRICE",

                        weight:
                            5,

                        finalPrice:
                            100000000,

                        laborPercent:
                            15,

                        profitPercent:
                            7

                    });



                expect(
                    result.goldPrice
                )
                .toBeDefined();


            }
        );



        it(
            "should calculate reverse weight",
            () => {


                const useCase =
                    new CalculateReverseGoldUseCase(
                        new ReverseGoldCalculator()
                    );



                const result =
                    useCase.execute({

                        target:
                            "WEIGHT",

                        goldPrice:
                            18000000,

                        finalPrice:
                            100000000,

                        laborPercent:
                            15,

                        profitPercent:
                            7

                    });



                expect(
                    result.weight
                )
                .toBeDefined();


            }
        );


    }
);