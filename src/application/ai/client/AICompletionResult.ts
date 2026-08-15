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


}