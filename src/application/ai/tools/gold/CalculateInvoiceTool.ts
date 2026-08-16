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


import {
    CalculateInvoiceToolSchema
} from "./CalculateInvoiceToolSchema";


import {
    CalculateInvoiceToolMapper
} from "./CalculateInvoiceToolMapper";



export class CalculateInvoiceTool

implements AITool {



    readonly name =

        "calculate_gold_invoice";



    readonly description =

        "Calculates a complete gold invoice including labor, profit, tax and discount.";




    readonly inputSchema =

        CalculateInvoiceToolSchema;



    private readonly mapper:

        CalculateInvoiceToolMapper;





    constructor(

        private readonly useCase:

            CalculateInvoiceUseCase,


        mapper?:

            CalculateInvoiceToolMapper

    ) {


        this.mapper =

            mapper ??

            new CalculateInvoiceToolMapper();


    }






    async execute(

        input:

            unknown,

        _context:

            AIToolContext

    ):

        Promise<AIToolResult> {



        try {



            const validatedInput =

                CalculateInvoiceToolSchema.parse(

                    input

                );





            const invoiceInput =

                this.mapper.map(

                    validatedInput

                );





            const result =

                this.useCase.execute(

                    invoiceInput

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