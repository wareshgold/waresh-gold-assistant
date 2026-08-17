import {
    AIToolCall
}
from "../models/AIToolCall";


import {
    AICompletionResult
}
from "../client/AICompletionResult";



export class AIToolDecisionService {



    decide(

        result:

            string | AICompletionResult

    ):

        AIToolCall | undefined {



        if (

            typeof result === "string"

        ) {


            return this.parseToolCall(

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






        return this.parseToolCall(

            result.content

        );


    }










    private parseToolCall(

        content:

            string

    ):

        AIToolCall | undefined {



        if (!content) {

            return undefined;

        }





        const legacyToolCall =

            this.parseLegacyToolCall(

                content

            );





        if (

            legacyToolCall

        ) {


            return legacyToolCall;


        }





        return this.parseNamedToolCall(

            content

        );


    }










    private parseLegacyToolCall(

        content:

            string

    ):

        AIToolCall | undefined {



        const match =

            content.match(

                /<tool>\s*([\s\S]*?)\s*<\/tool>/i

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










    private parseNamedToolCall(

        content:

            string

    ):

        AIToolCall | undefined {



        const match =

            content.match(

                /<([a-zA-Z0-9_-]+)>\s*([\s\S]*?)\s*<\/\1>/i

            );





        if (!match) {

            return undefined;

        }





        const toolName =

            match[1];





        const payloadText =

            match[2].trim();





        if (!payloadText) {


            return {


                toolName,

                input: {}

            };


        }





        try {


            const payload =

                JSON.parse(

                    payloadText

                );





            if (

                payload &&

                typeof payload === "object" &&

                !Array.isArray(payload)

            ) {



                const record =

                    payload as Record<string, unknown>;





                if (

                    typeof record.toolName === "string"

                ) {


                    return {


                        toolName:

                            record.toolName,



                        input:

                            record.input ?? {}



                    };


                }


            }





            return {


                toolName,



                input:

                    payload ?? {}


            };


        }

        catch {


            return undefined;


        }


    }


}