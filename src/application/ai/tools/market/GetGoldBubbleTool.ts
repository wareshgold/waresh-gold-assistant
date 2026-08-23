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

        "Returns the current gold bubble amount and bubble percentage. bubbleAmount is the actual bubble amount in Iranian toman; do not confuse it with intrinsicPrice or marketPrice.";



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


            const data =

                result.data as {
                    bubbleAmount?: unknown;
                    bubblePercentage?: unknown;
                } | undefined;


            return {


                success:

                    true,


                data: {

                    bubbleAmount:
                        data?.bubbleAmount,

                    bubblePercentage:
                        data?.bubblePercentage

                }


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