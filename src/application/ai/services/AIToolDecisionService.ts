import {
    AIToolCall
} from "../models/AIToolCall";


import {
    AICompletionResult
} from "../client/AICompletionResult";



export class AIToolDecisionService {



    decide(

        result:

            string | AICompletionResult

    ):

        AIToolCall | undefined {



        if (

            typeof result === "string"

        ) {


            return this.parseLegacyToolCall(

                result

            );


        }





        if (

            result.toolCalls &&

            result.toolCalls.length > 0

        ) {


            const toolCall =

                result.toolCalls[0];



            return {


                toolName:

                    toolCall.name,



                input:

                    toolCall.arguments ?? {}



            };


        }






        return this.parseLegacyToolCall(

            result.content

        );


    }










    private parseLegacyToolCall(

        content:

            string

    ):

        AIToolCall | undefined {



        if (!content) {

            return undefined;

        }





        const match =

            content.match(

                /<tool>(.*?)<\/tool>/s

            );





        if (!match) {

            return undefined;

        }






        try {


            const payload =

                JSON.parse(

                    match[1]

                );





            if (

                typeof payload.toolName !== "string"

            ) {


                return undefined;


            }






            return {


                toolName:

                    payload.toolName,



                input:

                    payload.input ?? {}



            };



        }

        catch {


            return undefined;


        }


    }


}