import {
    AIClient
} from "../client/AIClient";


import {
    AIMessage
} from "../client/AIMessage";


import {
    AIRequest
} from "../models/AIRequest";


import {
    AIResponse
} from "../models/AIResponse";


import {
    AIToolRegistry
} from "../tools/AIToolRegistry";


import {
    AIToolExecutionService
} from "./AIToolExecutionService";



export class AIService {



    constructor(

        private readonly client:

            AIClient,


        private readonly toolRegistry?:

            AIToolRegistry,


        private readonly toolExecutionService?:

            AIToolExecutionService

    ) {}







    async process(

        request:

            AIRequest

    ):

        Promise<AIResponse> {



        const messages:

            AIMessage[] = [



                {

                    role:

                        "system",


                    content:

                        this.buildSystemPrompt()

                },


                {

                    role:

                        "user",


                    content:

                        request.message

                }


            ];







        let result =

            await this.client.complete(

                messages

            );








        let toolResult;






        if (

            this.toolExecutionService

        ) {



            toolResult =

                await this.toolExecutionService.executeIfRequired(

                    result.content,

                    {

                        userId:

                            request.userId

                    }

                );







            if (toolResult) {



                messages.push({


                    role:

                        "assistant",



                    content:

                        result.content



                });








                messages.push({



                    role:

                        "user",



                    content:

                        `

Tool execution result:

${JSON.stringify(toolResult.data)}

Explain this result to the user in Persian.

`

                });








                result =

                    await this.client.complete(

                        messages

                    );


            }



        }








        return {



            content:

                result.content,



            metadata:

            {

                model:

                    result.model,



                usage:

                    result.usage,



                userId:

                    request.userId,



                toolExecuted:

                    Boolean(toolResult),



                toolSuccess:

                    toolResult?.success,



                availableTools:

                    this.toolRegistry

                        ?.getTools()

                        .map(

                            tool =>

                                tool.name

                        )

            }



        };


    }









    private buildSystemPrompt():

        string {



        const tools =

            this.toolRegistry

                ?.getTools()

                .map(

                    tool =>

                        `[${tool.name}]

Purpose:

${tool.description}`

                )

                .join("\n\n");







        const basePrompt = `

You are Waresh Gold AI assistant.

You are an assistant for Iranian gold market users.

Rules:

- Never invent gold prices.
- Never estimate or guess market values.
- Never calculate market prices yourself.
- For current gold price, gram price, mithqal price, ounce price, always use market tools.
- For gold calculations, always use calculation tools.
- Use tool results as the only source of truth.
- After receiving tool results, explain the result in Persian.
- Use تومان for Iranian prices.
- Format numbers clearly.
- Keep answers short and useful.

Tool selection rules:

- User asks current price -> use market price tools.
- User asks mithqal price -> use mithqal market tool.
- User asks gold calculation -> use calculation tools.
- User asks invoice/reverse calculation -> use the related calculation tool.
- Do not answer before using a required tool.

`;








        if (!tools) {


            return basePrompt;


        }








        return `

${basePrompt}


Available tools:


${tools}


When a tool is required, return ONLY this format:


<tool>
{
 "toolName":"tool_name",
 "input":{}
}
</tool>


Do not include any explanation before tool execution.

`;

    }


}