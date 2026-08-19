import {
    AIToolResult
} from "../tools/AIToolResult";


export interface AIToolExecutionResult {


    toolCallId:

        string;



    toolName:

        string;



    result:

        AIToolResult;


}