import { ReverseCalculationInput } from "./models/ReverseCalculationInput";
import { ReverseCalculationResult } from "./models/ReverseCalculationResult";
import { GoldFormulaCalculator } from "../services/GoldFormulaCalculator";
import { roundMoney } from "../../../shared/utils/number";


export class ReverseGoldCalculator {


    constructor(
        private readonly formulaCalculator =
            new GoldFormulaCalculator()
    ) {}



    calculate(
        input: ReverseCalculationInput
    ): ReverseCalculationResult {


        if (input.target === "GOLD_PRICE") {

            if (!input.weight) {
                throw new Error("Weight is required");
            }

            return {
                goldPrice:
                    this.solveGoldPrice(input)
            };

        }



        if (input.target === "WEIGHT") {

            if (!input.goldPrice) {
                throw new Error("Gold price is required");
            }

            return {
                weight:
                    this.solveWeight(input)
            };

        }



        if (input.target === "LABOR_PERCENT") {

            if (!input.goldPrice || !input.weight) {
                throw new Error(
                    "Gold price and weight are required"
                );
            }

            return this.solveLaborPercent(input);

        }



        throw new Error(
            "Unsupported reverse calculation target"
        );

    }



    private solveGoldPrice(
        input: ReverseCalculationInput
    ): number {


        let low = 0;

        let high =
            input.finalPrice /
            (input.weight ?? 1);



        for (
            let i = 0;
            i < 50;
            i++
        ) {

            const middle =
                (low + high) / 2;


            const result =
                this.formulaCalculator.calculate({

                    weight:
                        input.weight ?? 0,

                    goldPrice:
                        middle,

                    laborPercent:
                        input.laborPercent ?? 0,

                    profitPercent:
                        input.profitPercent,

                    taxPercent:
                        input.taxPercent,

                    discount:
                        input.discount

                });



            if (
                result.finalPrice >
                input.finalPrice
            ) {

                high = middle;

            } else {

                low = middle;

            }

        }


        return roundMoney(
            (low + high) / 2
        );

    }




    private solveWeight(
        input: ReverseCalculationInput
    ): number {


        let low = 0;

        let high =
            input.finalPrice /
            (input.goldPrice ?? 1);



        for (
            let i = 0;
            i < 50;
            i++
        ) {

            const middle =
                (low + high) / 2;


            const result =
                this.formulaCalculator.calculate({

                    weight:
                        middle,

                    goldPrice:
                        input.goldPrice ?? 0,

                    laborPercent:
                        input.laborPercent ?? 0,

                    profitPercent:
                        input.profitPercent,

                    taxPercent:
                        input.taxPercent,

                    discount:
                        input.discount

                });



            if (
                result.finalPrice >
                input.finalPrice
            ) {

                high = middle;

            } else {

                low = middle;

            }

        }


        return (
            low + high
        ) / 2;

    }




    private solveLaborPercent(
        input: ReverseCalculationInput
    ): ReverseCalculationResult {


        let low = 0;

        let high = 100;



        for (
            let i = 0;
            i < 50;
            i++
        ) {


            const middle =
                (low + high) / 2;



            const result =
                this.formulaCalculator.calculate({

                    weight:
                        input.weight ?? 0,

                    goldPrice:
                        input.goldPrice ?? 0,

                    laborPercent:
                        middle,

                    profitPercent:
                        input.profitPercent,

                    taxPercent:
                        input.taxPercent,

                    discount:
                        input.discount

                });



            if (
                result.finalPrice >
                input.finalPrice
            ) {

                high = middle;

            } else {

                low = middle;

            }

        }


        const laborPercent =
            (low + high) / 2;



        const laborResult =
            this.formulaCalculator.calculate({

                weight:
                    input.weight ?? 0,

                goldPrice:
                    input.goldPrice ?? 0,

                laborPercent,

                profitPercent:
                    input.profitPercent,

                taxPercent:
                    input.taxPercent,

                discount:
                    input.discount

            });



        return {

            laborPercent:
                Number(
                    laborPercent.toFixed(2)
                ),

            laborAmount:
                roundMoney(
                    laborResult.labor
                )

        };

    }


}