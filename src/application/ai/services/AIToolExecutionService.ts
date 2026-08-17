import {
    AIToolDecisionService
} from "./AIToolDecisionService";


import {
    AIToolExecutor
} from "../tools/AIToolExecutor";


import {
    AIToolContext
} from "../tools/AITool";


import {
    AIToolResult
} from "../tools/AIToolResult";


import {
    AICompletionResult
} from "../client/AICompletionResult";



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



        const decision =

            this.decisionService.decide(

                result

            );



        if (!decision) {


            return undefined;


        }





        return this.executor.execute(

            decision.toolName,

            decision.input,

            context

        );


    }


}