import {
    ApplicationResponse
}
from "../common/models/ApplicationResponse";



export interface ActionExecutionContext {


    userId?: string;


    username?: string;


    firstName?: string;


    payload?: unknown;


}





export interface ActionHandler {


    execute(

        context:

            ActionExecutionContext

    ):

        Promise<ApplicationResponse>;


}