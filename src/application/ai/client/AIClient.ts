import {
    AIMessage
}
from "./AIMessage";


import {
    AICompletionResult
}
from "./AICompletionResult";





export interface AIClient {


    complete(

        messages:

            AIMessage[]

    ):

        Promise<AICompletionResult>;


}