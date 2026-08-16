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


import {
    AIToolDecisionService
} from "./AIToolDecisionService";



export class AIService {



    private readonly toolDecisionService:

        AIToolDecisionService;





    constructor(

        private readonly client:

            AIClient,


        private readonly toolRegistry?:

            AIToolRegistry,


        private readonly toolExecutionService?:

            AIToolExecutionService

    ) {


        this.toolDecisionService =

            new AIToolDecisionService();


    }







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








        const toolCall =

            this.toolDecisionService.decide(

                result.content

            );








        let toolResult;






        if (

            toolCall

            &&

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

                        `${tool.name}: ${tool.description}`

                )

                .join("\n");







        const basePrompt = `

You are Waresh Gold AI assistant.

You are an assistant for Iranian gold market users.

Rules:

- Never invent gold prices.
- Never calculate market prices yourself.
- For current gold price, gram price, mithqal price, ounce price, always use tools.
- For gold calculations, always use calculation tools.
- After receiving tool results, answer in Persian.
- Use تومان for Iranian prices.
- Format numbers clearly.
- Keep answers short and useful.

`;








        if (!tools) {


            return basePrompt;


        }








        return `

${basePrompt}


Available tools:


${tools}


When you need a tool, return ONLY this format:


<tool>
{
 "toolName":"tool_name",
 "input":{}
}
</tool>


Do not answer before using the tool.

`;

    }


}