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
    CalculateReverseGoldToolSchema
} from "./CalculateReverseGoldToolSchema";



export class CalculateReverseGoldTool

implements AITool {



    readonly name =

        "calculate_reverse_gold";



    readonly description =

        "Calculates reverse gold values from final price and parameters.";



    readonly inputSchema =

        CalculateReverseGoldToolSchema;





    constructor(

        private readonly useCase:

            CalculateReverseGoldUseCase

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
                        CalculateReverseGoldUseCase["execute"]
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

                        : "Failed to reverse calculate gold"


            };


        }


    }


}