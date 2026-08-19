export interface AIToolCallDecision {

    id?: string;


    toolName: string;


    input: Record<string, unknown>;

}