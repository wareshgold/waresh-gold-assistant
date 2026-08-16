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





        const toolResult =

            await this.toolExecutionService

                ?.executeIfRequired(

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

                    `Tool result:\n${JSON.stringify(toolResult.data)}`


            });





            result =

                await this.client.complete(

                    messages

                );


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

                            tool => tool.name

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

                        `${tool.name}: ${tool.description}`

                )

                .join("\n");





        if (!tools) {


            return (

                "You are Waresh Gold AI assistant."

            );


        }





        return `

You are Waresh Gold AI assistant.

Available tools:

${tools}

If you need a tool, return:

<tool>
{
 "toolName":"tool_name",
 "input":{}
}
</tool>

`;

    }


}