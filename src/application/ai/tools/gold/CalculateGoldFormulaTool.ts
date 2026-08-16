import {
    AITool,
    AIToolContext
} from "../AITool";


import {
    AIToolResult
} from "../AIToolResult";


import {
    CalculateGoldFormulaUseCase
} from "../../../gold/CalculateGoldFormulaUseCase";



export class CalculateGoldFormulaTool

implements AITool {



    readonly name =

        "calculate_gold_formula";



    readonly description =

        "Solves gold calculation formulas and returns calculated values.";





    constructor(

        private readonly useCase:

            CalculateGoldFormulaUseCase

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
                        CalculateGoldFormulaUseCase["execute"]
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

                        : "Failed to calculate gold formula"


            };



        }


    }


}