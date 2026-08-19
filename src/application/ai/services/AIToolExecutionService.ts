import {
    AIToolDecisionService
}
from "./AIToolDecisionService";


import {
    AIToolExecutor
}
from "../tools/AIToolExecutor";


import {
    AIToolContext
}
from "../tools/AITool";


import {
    AICompletionResult
}
from "../client/AICompletionResult";


import {
    AIToolResult
}
from "../tools/AIToolResult";


import {
    AIToolExecutionResult
}
from "../models/AIToolExecutionResult";



export class AIToolExecutionService {



    constructor(

        private readonly decisionService:

            AIToolDecisionService,


        private readonly executor:

            AIToolExecutor

    ) {}






    async executeIfRequired(

        result:

            string | AICompletionResult,


        context:

            AIToolContext = {}

    ):
        Promise<AIToolResult | undefined> {



        const executions =

            await this.executeAll(

                result,

                context

            );



        if (

            executions.length === 0

        ) {

            return undefined;

        }



        return executions[0].result;


    }







    async executeAll(

        result:

            string | AICompletionResult,


        context:

            AIToolContext = {}

    ):
        Promise<AIToolExecutionResult[]> {



        const decisions =

            this.decisionService.decideAll(

                result

            );



        if (

            decisions.length === 0

        ) {

            return [];

        }






        return Promise.all(

            decisions.map(

                async decision => {



                    const executionResult =

                        await this.executor.execute(

                            decision.toolName,

                            decision.input,

                            context

                        );





                    return {


                        toolCallId:

                            decision.id ??

                            `tool-call-${Date.now()}`,



                        toolName:

                            decision.toolName,



                        result:

                            executionResult


                    };


                }

            )

        );


    }


}