import {
    AIClient,
    AICompletionOptions
}
from "../../../application/ai/client/AIClient";


import {
    AIMessage
}
from "../../../application/ai/client/AIMessage";


import {
    AICompletionResult
}
from "../../../application/ai/client/AICompletionResult";


import {
    AIToolDefinition
}
from "../../../application/ai/tools/AIToolDefinition";


import {
    MetricRecorder
}
from "../../../application/system/observability/MetricRecorder";


import {
    MetricType
}
from "../../../domain/system/observability/MetricType";


import {
    z
}
from "zod";





interface NvidiaToolCall {


    id?:

        string;



    type?:

        string;



    function?: {


        name?:

            string;



        arguments?:

            string;


    };


}





interface NvidiaResponse {

    choices?: {

        message?: {

            content?:

                string | null;



            tool_calls?:

                NvidiaToolCall[];


        };

    }[];


    model?: string;


    usage?: {

        prompt_tokens?: number;


        completion_tokens?: number;

    };

}





export class NvidiaAIClient

implements AIClient {



    constructor(

        private readonly apiKey:

            string,


        private readonly apiUrl:

            string =

                "https://integrate.api.nvidia.com/v1/chat/completions",


        private readonly model:

            string =

                "meta/llama-3.3-70b-instruct",


        private readonly metricRecorder?:

            MetricRecorder

    ) {}







    async complete(

        messages:

            AIMessage[],

        options?:

            AICompletionOptions

    ):

        Promise<AICompletionResult> {



        const requestBody:

            Record<string, unknown> = {


            model:

                this.model,



            messages:

                messages.map(

                    message =>

                        this.mapMessage(

                            message

                        )

                )

        };





        if (
            options?.tools &&
            options.tools.length > 0
        ) {

            requestBody.tools =
                options.tools.map(
                    tool =>
                        this.mapToolDefinition(
                            tool
                        )
                );


            requestBody.parallel_tool_calls =
                false;


            requestBody.tool_choice =
                "auto";

        }







        const startedAt =

            Date.now();





        const response =

            await fetch(

                this.apiUrl,

                {


                    method:

                        "POST",



                    headers:

                    {

                        "Content-Type":

                            "application/json",


                        Accept:

                            "application/json",


                        Authorization:

                            `Bearer ${this.apiKey}`

                    },



                    body:

                        JSON.stringify(

                            requestBody

                        )


                }

            );





        await this.recordDuration(

            MetricType.AI_NVIDIA_REQUEST_DURATION,

            Date.now() - startedAt

        );





        if (!response.ok) {



            let errorBody = "";



            try {



                errorBody =

                    await response.text();


            }

            catch {


                errorBody = "";


            }





            console.error(

                "NVIDIA API ERROR:",

                {

                    status:

                        response.status,


                    body:

                        errorBody

                }

            );





            throw new Error(

                `NVIDIA AI request failed: ${response.status}`

                +

                (

                    errorBody

                        ?

                        ` ${errorBody}`

                        :

                        ""

                )

            );


        }






        const data =

            await response.json() as NvidiaResponse;





        const message =

            data.choices?.[0]?.message;





        console.log(

            "NVIDIA TOOL CALL RESPONSE:",

            message?.tool_calls

        );





        if (

            !message?.content &&

            !message?.tool_calls?.length

        ) {



            console.warn(

                "NVIDIA returned empty response",

                {

                    model:

                        data.model,


                    usage:

                        data.usage

                }

            );


        }





        return {


            content:

                message?.content ??

                "",



            model:

                data.model,



            usage:

            {

                inputTokens:

                    data.usage?.prompt_tokens,



                outputTokens:

                    data.usage?.completion_tokens

            },



            toolCalls:

                message?.tool_calls

                    ?.filter(

                        toolCall =>

                            Boolean(

                                toolCall.function?.name

                            )

                    )

                    .map(

                        toolCall =>

                            ({

                                id:

                                    toolCall.id,


                                name:

                                    toolCall.function?.name ?? "",


                                arguments:

                                    this.parseArguments(

                                        toolCall.function?.arguments

                                    )

                            })

                    )

        };


    }







    private async recordDuration(

        type:

            MetricType,


        duration:

            number

    ):

        Promise<void> {


        if (

            !this.metricRecorder

        ) {


            return;


        }





        try {


            await this.metricRecorder.record(

                type,

                duration

            );


        }

        catch(error) {


            console.error(

                "AI metric recording failed:",

                error

            );


        }


    }







    private mapMessage(

        message:

            AIMessage

    ):

        Record<string, unknown> {



        if (

            message.role === "assistant" &&

            message.toolCalls &&

            message.toolCalls.length > 0

        ) {



            return {


                role:

                    "assistant",


                content:

                    message.content || null,


                tool_calls:

                    message.toolCalls.map(

                        toolCall => ({

                            id:

                                toolCall.id,


                            type:

                                "function",


                            function:

                            {

                                name:

                                    toolCall.name,


                                arguments:

                                    this.serializeArguments(

                                        toolCall.arguments

                                    )

                            }

                        })

                    )


            };


        }





        if (

            message.role === "tool"

        ) {



            return {


                role:

                    "tool",


                content:

                    message.content,


                tool_call_id:

                    message.toolCallId

            };


        }





        return {


            role:

                message.role,


            content:

                message.content

        };


    }







    private mapToolDefinition(

        tool:

            AIToolDefinition

    ):

        Record<string, unknown> {



        return {


            type:

                "function",


            function:

            {

                name:

                    tool.name,


                description:

                    tool.description,


                parameters:

                    this.toJsonSchema(

                        tool.parameters

                    )

            }


        };


    }







    private toJsonSchema(

        parameters:

            unknown

    ):

        unknown {



        if (!parameters) {


            return {


                type:

                    "object",


                properties:

                {}

            };


        }





        try {


            return z.toJSONSchema(

                parameters as Parameters<
                    typeof z.toJSONSchema
                >[0],

                {

                    target:

                        "draft-07"

                }

            );


        }

        catch {


            if (

                this.isJsonSchema(

                    parameters

                )

            ) {


                return parameters;


            }





            return {


                type:

                    "object",


                properties:

                {}

            };


        }


    }







    private isJsonSchema(

        value:

            unknown

    ):

        boolean {



        if (

            typeof value !== "object" ||

            value === null

        ) {


            return false;


        }





        const schema =

            value as Record<string, unknown>;





        return (

            typeof schema.type === "string" ||

            typeof schema.$schema === "string" ||

            typeof schema.properties === "object"

        );


    }







    private parseArguments(

        value:

            string |

            undefined

    ):

        unknown {



        if (!value) {


            return {};


        }





        try {


            return JSON.parse(

                value

            );


        }

        catch {


            return value;


        }


    }







    private serializeArguments(

        value:

            unknown

    ):

        string {



        if (

            typeof value === "string"

        ) {


            return value;


        }





        try {


            return JSON.stringify(

                value ?? {}

            );


        }

        catch {


            return "{}";


        }


    }


}