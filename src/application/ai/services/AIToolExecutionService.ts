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

    ) {



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