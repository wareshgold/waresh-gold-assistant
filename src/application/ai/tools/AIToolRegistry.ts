import {
    AITool
} from "./AITool";


import {
    AIToolDefinition
} from "./AIToolDefinition";



export interface AIToolRegistry {


    register<TInput = unknown>(

        tool: AITool<TInput>

    ): void;



    getTool<TInput = unknown>(

        name: string

    ): AITool<TInput> | undefined;



    getTools():

        AITool[];



    getToolDefinitions():

        AIToolDefinition[];


}