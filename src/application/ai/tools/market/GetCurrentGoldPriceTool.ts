import {
    AITool,
    AIToolContext
} from "../AITool";


import {
    AIToolResult
} from "../AIToolResult";


import {
    GetCurrentGoldPriceUseCase
} from "../../../gold/GetCurrentGoldPriceUseCase";


import {
    GetCurrentGoldPriceToolSchema
} from "./GetCurrentGoldPriceToolSchema";



export class GetCurrentGoldPriceTool

implements AITool {



    readonly name =

        "get_current_gold_price";



    readonly description =

        "Returns the current 18k gold market price.";



    readonly inputSchema =

        GetCurrentGoldPriceToolSchema;





    constructor(

        private readonly useCase:

            GetCurrentGoldPriceUseCase

    ) {}





    async execute(

        _input: unknown,

        _context: AIToolContext

    ):

        Promise<AIToolResult> {



        try {


            const result =

                await this.useCase.execute();




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

                        : "Failed to get current gold price"

            };


        }


    }


}