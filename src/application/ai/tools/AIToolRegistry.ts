import {
    AITool
} from "./AITool";


export interface AIToolRegistry {


    register(

        tool: AITool

    ): void;



    getTool(

        name: string

    ): AITool | undefined;



    getTools():

        AITool[];

}