import {
    AITool,
    AIToolContext
} from "../AITool";


import {
    AIToolResult
} from "../AIToolResult";


import {
    CalculateInvoiceUseCase
} from "../../../gold/CalculateInvoiceUseCase";



export class CalculateInvoiceTool

implements AITool {



    readonly name =

        "calculate_gold_invoice";



    readonly description =

        "Calculates a complete gold invoice including labor, profit, tax and discount.";





    constructor(

        private readonly useCase:

            CalculateInvoiceUseCase

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

                    input as any

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

                        : "Failed to calculate invoice"


            };


        }


    }


}