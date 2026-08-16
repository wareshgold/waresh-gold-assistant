import {
    AIToolContext
}
from "./AITool";


import {
    AIToolRegistry
}
from "./AIToolRegistry";


import {
    AIToolResult
}
from "./AIToolResult";





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







        return tool.execute(

            input,

            context

        );



    }



}