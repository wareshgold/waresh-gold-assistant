import {
    AIToolContext
} from "./AITool";


import {
    AIToolRegistry
} from "./AIToolRegistry";


import {
    AIToolResult
} from "./AIToolResult";



export class AIToolExecutor {


    constructor(

        private readonly registry:

            AIToolRegistry

    ) {}



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




        try {


            return await tool.execute(

                input,

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