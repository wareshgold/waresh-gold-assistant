import {
    AIMessage
}
from "./AIMessage";


import {
    AICompletionResult
}
from "./AICompletionResult";


import {
    AIToolDefinition
}
from "../tools/AIToolDefinition";





export interface AICompletionOptions {


    tools?:

        AIToolDefinition[];


}





export interface AIClient {


    complete(

        messages:

            AIMessage[],

        options?:

            AICompletionOptions

    ):

        Promise<AICompletionResult>;



}