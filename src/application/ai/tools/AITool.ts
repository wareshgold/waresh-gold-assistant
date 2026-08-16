import { AIToolResult } from "./AIToolResult";


export interface AIToolContext {

    userId?: string;

    sessionId?: string;

    metadata?: Record<string, unknown>;

}


export interface AITool {

    name: string;


    description: string;


    execute(

        input: unknown,

        context: AIToolContext

    ): Promise<AIToolResult>;

}