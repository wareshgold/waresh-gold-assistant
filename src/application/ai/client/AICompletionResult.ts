export interface AIToolCallResult {


    id?:

        string;



    name:

        string;



    arguments:

        unknown;


}






export interface AICompletionResult {


    content:

        string;



    model?:

        string;



    usage?: {


        inputTokens?:

            number;



        outputTokens?:

            number;



    };



    toolCalls?:

        AIToolCallResult[];


}