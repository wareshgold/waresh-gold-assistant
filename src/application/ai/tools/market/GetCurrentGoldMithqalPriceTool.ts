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



export class GetCurrentGoldMithqalPriceTool

implements AITool {



    readonly name =

        "get_current_gold_mithqal_price";



    readonly description =

        "Returns the current 18k gold price converted to one mithqal price.";




    constructor(

        private readonly useCase:

            GetCurrentGoldPriceUseCase

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




            const mithqalPrice =

                Math.round(

                    result.price * 4.608

                );





            return {


                success:

                    true,


                data:

                {

                    pricePerGram18k:

                        result.price,


                    mithqal:

                        4.608,


                    mithqalPrice

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

                        : "Failed to get current mithqal price"


            };


        }


    }


}