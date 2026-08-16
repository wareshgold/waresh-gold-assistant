import {
    AIContext
} from "./AIContext";



export interface AIContextProvider {


    getContext(

        userId?: string

    ):

        Promise<AIContext>;


}