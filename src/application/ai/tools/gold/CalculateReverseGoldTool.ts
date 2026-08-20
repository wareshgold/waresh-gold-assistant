import {
    AITool,
    AIToolContext
} from "../AITool";


import {
    AIToolResult
} from "../AIToolResult";


import {
    CalculateReverseGoldUseCase
} from "../../../gold/CalculateReverseGoldUseCase";


import {
    GetCurrentGoldPriceUseCase
} from "../../../gold/GetCurrentGoldPriceUseCase";


import {
    CalculateReverseGoldToolSchema
} from "./CalculateReverseGoldToolSchema";


import {
    ReverseCalculationInput
} from "../../../../domain/gold/calculator/models/ReverseCalculationInput";



export class CalculateReverseGoldTool

implements AITool {



    readonly name =

        "calculate_reverse_gold";



    readonly description =

        "Calculates reverse gold values from final price. Use target LABOR_PERCENT to find labor when weight, final price and market gold price are known. If goldPrice is omitted, current market price is used automatically.";



    readonly inputSchema =

        CalculateReverseGoldToolSchema;





    constructor(

        private readonly useCase:

            CalculateReverseGoldUseCase,


        private readonly getCurrentGoldPriceUseCase:

            GetCurrentGoldPriceUseCase

    ) {}





    async execute(

        input:

            unknown,

        _context:

            AIToolContext

    ):

        Promise<AIToolResult> {



        try {



            const parsed =

                CalculateReverseGoldToolSchema.parse(
                    input
                );



            const resolved =

                await this.resolveInput(
                    parsed
                );



            const result =

                this.useCase.execute(
                    resolved
                );





            return {


                success:

                    true,


                data:

                    {

                        ...result,


                        target:

                            resolved.target,


                        finalPrice:

                            resolved.finalPrice,


                        weight:

                            resolved.weight,


                        goldPrice:

                            resolved.goldPrice,


                        profitPercent:

                            resolved.profitPercent,


                        taxPercent:

                            resolved.taxPercent ?? 0

                    }


            };



        }

        catch (error) {



            return {


                success:

                    false,


                error:

                    error instanceof Error

                        ? error.message

                        : "Failed to reverse calculate gold"


            };


        }


    }





    private async resolveInput(

        parsed: {

            target:
                "GOLD_PRICE" | "WEIGHT" | "LABOR_PERCENT";

            finalPrice:
                number;

            goldPrice?:
                number;

            weight?:
                number;

            laborPercent?:
                number;

            profitPercent?:
                number;

            taxPercent?:
                number;

            discount?:
                number;

        }

    ):

        Promise<ReverseCalculationInput> {



        let goldPrice =

            parsed.goldPrice;



        const needsGoldPrice =

            parsed.target === "LABOR_PERCENT" ||

            parsed.target === "WEIGHT";



        if (

            needsGoldPrice &&

            (
                goldPrice === undefined ||
                goldPrice <= 0
            )

        ) {



            const market =

                await this.getCurrentGoldPriceUseCase.execute();



            goldPrice =
                market.price;

        }



        return {

            target:
                parsed.target,


            finalPrice:
                parsed.finalPrice,


            goldPrice,


            weight:
                parsed.weight,


            laborPercent:
                parsed.laborPercent,


            profitPercent:
                parsed.profitPercent ?? 0,


            taxPercent:
                parsed.taxPercent ?? 0,


            discount:
                parsed.discount ?? 0

        };

    }


}