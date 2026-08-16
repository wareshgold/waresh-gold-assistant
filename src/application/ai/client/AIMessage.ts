export type AIMessageRole =

    | "system"

    | "user"

    | "assistant"

    | "tool";





export interface AIMessage {


    role:

        AIMessageRole;



    content:

        string;



    toolCallId?:

        string;


}