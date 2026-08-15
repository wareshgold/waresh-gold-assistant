import { AIToolResult } from "./AIToolResult";


export interface AIToolContext {

    userId?: string;

}


export interface AITool {

    name: string;


    description: string;


    execute(

        input: unknown,

        context: AIToolContext

    ): Promise<AIToolResult>;

}