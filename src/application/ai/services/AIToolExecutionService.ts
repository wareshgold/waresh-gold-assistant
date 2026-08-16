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



export class AIToolExecutionService {



    constructor(

        private readonly decisionService:

            AIToolDecisionService,


        private readonly executor:

            AIToolExecutor

    ) {}





    async executeIfRequired(

        content:

            string,


        context:

            AIToolContext = {}

    ):

        Promise<AIToolResult | undefined> {



        const decision =

            this.decisionService.decide(

                content

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