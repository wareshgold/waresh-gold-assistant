import {
    AITool,
    AIToolContext
} from "../AITool";


import {
    AIToolResult
} from "../AIToolResult";


import {
    CalculateGoldPriceUseCase
} from "../../../gold/CalculateGoldPriceUseCase";


import {
    CalculateGoldPriceToolSchema
} from "./CalculateGoldPriceToolSchema";



export class CalculateGoldPriceTool

implements AITool {



    readonly name =

        "calculate_gold_price";



    readonly description =

        "Calculates gold price using weight, gold price, labor, profit and tax parameters.";




    readonly inputSchema =

        CalculateGoldPriceToolSchema;





    constructor(

        private readonly useCase:

            CalculateGoldPriceUseCase

    ) {}





    async execute(

        input:

            unknown,

        _context:

            AIToolContext

    ):

        Promise<AIToolResult> {



        try {



            const result =

                await this.useCase.execute(

                    input as Parameters<
                        CalculateGoldPriceUseCase["execute"]
                    >[0]

                );





            return {


                success:

                    true,


                data:

                    result


            };



        }

        catch(error) {



            return {


                success:

                    false,


                error:

                    error instanceof Error

                        ? error.message

                        : "Failed to calculate gold price"


            };


        }



    }


}