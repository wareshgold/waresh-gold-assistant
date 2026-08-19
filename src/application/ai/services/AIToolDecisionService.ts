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

        return this.decideAll(result)[0];

    }






    decideAll(

        result:
            string | AICompletionResult

    ):
        AIToolCall[] {



        if (typeof result === "string") {


            const decision =

                this.parseToolCall(result);



            return decision

                ? [decision]

                : [];

        }






        if (

            result.toolCalls &&

            result.toolCalls.length > 0

        ) {



            return result.toolCalls.map(toolCall => ({


                id:

                    toolCall.id,



                toolName:

                    toolCall.name,



                input:

                    toolCall.arguments ?? {}


            }));

        }







        const decision =

            this.parseToolCall(

                result.content

            );





        return decision

            ? [decision]

            : [];

    }









    private parseToolCall(

        content:

            string

    ):
        AIToolCall | undefined {



        if (!content) {


            return undefined;

        }






        return (

            this.parseLegacyToolCall(content)

            ??

            this.parseNamedToolCall(content)

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





            const toolName =

                payload.toolName

                ??

                payload.name;






            if (

                typeof toolName !== "string"

                ||

                toolName.trim().length === 0

            ) {


                return undefined;

            }






            return {


                toolName,



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






        if (

            [

                "tool",

                "input",

                "response",

                "message"

            ]

            .includes(

                toolName.toLowerCase()

            )

        ) {


            return undefined;

        }







        const payloadText =

            match[2].trim();






        if (!payloadText) {


            return {

                toolName,

                input: {}

            };

        }






        try {



            const parsed =

                JSON.parse(

                    payloadText

                );






            if (

                parsed &&

                typeof parsed === "object" &&

                "input" in parsed

            ) {



                if (

                    !parsed.input

                    ||

                    typeof parsed.input !== "object"

                ) {


                    return undefined;

                }






                return {


                    toolName,



                    input:

                        parsed.input



                };

            }







            return {


                toolName,



                input:

                    parsed ?? {}



            };



        }

        catch {



            return {


                toolName,



                input: {}



            };

        }

    }


}