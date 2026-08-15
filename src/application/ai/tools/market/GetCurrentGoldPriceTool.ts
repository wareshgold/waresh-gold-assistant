import {
    AITool,
    AIToolContext
}
from "../AITool";


import {
    AIToolResult
}
from "../AIToolResult";


import {
    GetCurrentGoldPriceUseCase
}
from "../../../gold/GetCurrentGoldPriceUseCase";



export class GetCurrentGoldPriceTool

implements AITool {



    readonly name =

        "get_current_gold_price";



    readonly description =

        "Returns the current 18k gold market price.";




    constructor(

        private readonly useCase:

            GetCurrentGoldPriceUseCase

    ) {}





    async execute(

        _input: unknown,

        _context: AIToolContext

    ):

        Promise<AIToolResult> {



        const result =

            await this.useCase.execute();




        return {

            success: true,

            data: result

        };

    }


}