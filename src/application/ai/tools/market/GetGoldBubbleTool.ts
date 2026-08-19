import {
    AITool,
    AIToolContext
} from "../AITool";


import {
    AIToolResult
} from "../AIToolResult";


import {
    GetGoldBubbleUseCase
} from "../../../market/GetGoldBubbleUseCase";


import {
    GetGoldBubbleToolSchema
} from "./GetGoldBubbleToolSchema";



export class GetGoldBubbleTool

implements AITool {



    readonly name =

        "get_gold_bubble";



    readonly description =

        "Returns current gold bubble analysis including intrinsic price, bubble amount and percentage.";



    readonly inputSchema =

        GetGoldBubbleToolSchema;





    constructor(

        private readonly useCase:

            GetGoldBubbleUseCase

    ) {}






    async execute(

        _input:

            unknown,


        _context:

            AIToolContext

    ):

        Promise<AIToolResult> {



        try {


            const result =

                await this.useCase.execute();





            return {


                success:

                    true,


                data:

                    result.data


            };



        }

        catch(error) {


            return {


                success:

                    false,


                error:

                    error instanceof Error

                        ? error.message

                        : "Failed to get gold bubble data"


            };


        }


    }


}