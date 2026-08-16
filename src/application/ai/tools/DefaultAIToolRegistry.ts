import {
    AITool
} from "./AITool";


import {
    AIToolRegistry
} from "./AIToolRegistry";


import {
    AIToolDefinition
} from "./AIToolDefinition";



export class DefaultAIToolRegistry

implements AIToolRegistry {



    private readonly tools:

        Map<string, AITool<any>> =

            new Map();





    register<TInput = unknown>(

        tool:

            AITool<TInput>

    ): void {


        this.tools.set(

            tool.name,

            tool

        );


    }





    getTool<TInput = unknown>(

        name:

            string

    ):

        AITool<TInput> | undefined {


        return this.tools.get(

            name

        ) as AITool<TInput> | undefined;


    }





    getTools():

        AITool[] {


        return Array.from(

            this.tools.values()

        );


    }





    getToolDefinitions():

        AIToolDefinition[] {


        return this.getTools()

            .map(

                tool => ({

                    name:

                        tool.name,


                    description:

                        tool.description,


                    parameters:

                        tool.inputSchema

                })

            );


    }


}