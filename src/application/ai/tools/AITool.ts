import {
    AIToolResult
} from "./AIToolResult";


import {
    AIToolSchema
} from "./AIToolSchema";



export interface AIToolContext {


    userId?: string;


    sessionId?: string;


    metadata?: Record<string, unknown>;


}





export interface AITool<TInput = unknown> {


    name: string;



    description: string;



    /**
     * Optional typed input schema.
     *
     * The schema is intentionally abstract
     * and independent from validation libraries.
     *
     * Zod or other validators can implement
     * this contract through adapters.
     */
    inputSchema?: AIToolSchema<TInput>;



    execute(

        input: TInput,

        context: AIToolContext

    ): Promise<AIToolResult>;


}