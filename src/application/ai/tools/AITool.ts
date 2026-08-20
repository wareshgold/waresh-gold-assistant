import {
    AIToolResult
} from "./AIToolResult";


import {
    AIToolSchema
} from "./AIToolSchema";



export interface AIToolContext {


    userId?:
        string;


    sessionId?:
        string;


    metadata?:
        Record<string, unknown>;


}





export interface AITool<TInput = unknown> {


    name:
        string;



    description:
        string;



    /**
     * Optional typed input schema.
     *
     * The schema is intentionally abstract
     * and independent from validation libraries.
     *
     * Zod or other validators can implement
     * this contract through adapters.
     */
    inputSchema?:
        AIToolSchema<TInput>;



    /**
     * Normalizes raw AI generated input
     * before schema validation.
     *
     * AI providers may return:
     * - JSON strings instead of objects
     * - wrong field names
     * - missing optional defaults
     *
     * Each tool owns its own input contract.
     */
    normalizeInput?(
        input:
            unknown
    ):
        unknown;



    execute(

        input:
            TInput,


        context:
            AIToolContext

    ):
        Promise<AIToolResult>;


}