import {
    AIToolResult
} from "./AIToolResult";



export interface AIToolContext {


    userId?: string;


    sessionId?: string;


    metadata?: Record<string, unknown>;


}





export interface AITool {


    name: string;



    description: string;



    /**
     * Optional input schema.
     *
     * This is intentionally typed as unknown
     * to keep AITool independent from validation libraries.
     *
     * Compatible schemas can be provided by infrastructure
     * such as Zod schemas.
     */
    inputSchema?: unknown;



    execute(

        input: unknown,

        context: AIToolContext

    ): Promise<AIToolResult>;


}