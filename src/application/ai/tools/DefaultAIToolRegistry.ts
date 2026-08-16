import {
    AITool
} from "./AITool";


import {
    AIToolRegistry
} from "./AIToolRegistry";



export class DefaultAIToolRegistry

implements AIToolRegistry {



    private readonly tools:

        Map<string, AITool> =

            new Map();





    register(

        tool: AITool

    ): void {


        this.tools.set(

            tool.name,

            tool

        );


    }





    getTool(

        name: string

    ):

        AITool | undefined {


        return this.tools.get(

            name

        );


    }





    getTools():

        AITool[] {


        return Array.from(

            this.tools.values()

        );


    }


}