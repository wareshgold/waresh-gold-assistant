export type AIMessageRole =

    | "system"

    | "user"

    | "assistant"

    | "tool";





export interface AIMessageToolCall {


    id:

        string;



    name:

        string;



    arguments:

        unknown;


}






export interface AIMessage {


    role:

        AIMessageRole;



    content:

        string;



    toolCallId?:

        string;



    toolCalls?:

        AIMessageToolCall[];


}