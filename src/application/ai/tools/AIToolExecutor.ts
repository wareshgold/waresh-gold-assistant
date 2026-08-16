import {
    AIToolContext
} from "./AITool";


import {
    AIToolRegistry
} from "./AIToolRegistry";


import {
    AIToolResult
} from "./AIToolResult";


import {
    AIToolInputValidator
} from "./AIToolInputValidator";



export class AIToolExecutor {


    private readonly inputValidator:

        AIToolInputValidator;




    constructor(

        private readonly registry:

            AIToolRegistry,


        inputValidator?:

            AIToolInputValidator

    ) {


        this.inputValidator =

            inputValidator ??

            new AIToolInputValidator();


    }





    async execute(

        toolName:

            string,


        input:

            unknown,


        context:

            AIToolContext = {}

    ):

        Promise<AIToolResult> {



        const tool =

            this.registry.getTool(

                toolName

            );




        if (!tool) {


            return {

                success:

                    false,


                error:

                    `AI tool not found: ${toolName}`

            };


        }





        const validation =

            this.inputValidator.validate(

                tool.inputSchema,

                input

            );





        if (

            !validation.success

        ) {


            return {

                success:

                    false,


                error:

                    validation.error ??

                    "Invalid tool input"

            };


        }





        try {


            return await tool.execute(

                validation.data,

                context

            );


        }

        catch (error) {


            return {

                success:

                    false,


                error:

                    error instanceof Error

                        ? error.message

                        : "AI tool execution failed"

            };


        }


    }


}