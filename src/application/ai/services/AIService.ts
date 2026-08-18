import {
    AIClient
}
from "../client/AIClient";


import {
    AIMessage
}
from "../client/AIMessage";


import {
    AIRequest
}
from "../models/AIRequest";


import {
    AIResponse
}
from "../models/AIResponse";


import {
    AIToolRegistry
}
from "../tools/AIToolRegistry";


import {
    AIToolExecutionService
}
from "./AIToolExecutionService";


import {
    AIPromptService
}
from "../prompts/AIPromptService";


import {
    AIConversationMemory
}
from "../memory/AIConversationMemory";


import {
    AIResponseFormatter
}
from "./AIResponseFormatter";



export class AIService {



    private readonly promptService:

        AIPromptService;



    private readonly responseFormatter:

        AIResponseFormatter;







    constructor(


        private readonly client:

            AIClient,


        private readonly toolRegistry?:

            AIToolRegistry,


        private readonly toolExecutionService?:

            AIToolExecutionService,


        promptService?:

            AIPromptService,


        private readonly memory?:

            AIConversationMemory,


        responseFormatter?:

            AIResponseFormatter

    ) {



        this.promptService =

            promptService ??

            new AIPromptService(

                toolRegistry

            );





        this.responseFormatter =

            responseFormatter ??

            new AIResponseFormatter();


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

                        this.promptService.buildSystemPrompt()

                }

            ];





        if (

            this.memory &&

            request.userId

        ) {



            const history =

                await this.memory.getHistory(

                    request.userId

                );



            messages.push(

                ...history.map(

                    item => ({

                        role:

                            item.role,

                        content:

                            item.content

                    })

                )

            );


        }





        messages.push({

            role:

                "user",

            content:

                request.message

        });







        const toolDefinitions =

            this.toolRegistry

                ?.getToolDefinitions();







        let result =

            await this.client.complete(

                messages,

                {

                    tools:

                        toolDefinitions

                }

            );







        let toolResult;







        if (

            this.toolExecutionService

        ) {



            toolResult =

                await this.toolExecutionService.executeIfRequired(

                    result,

                    {

                        userId:

                            request.userId,


                        metadata:

                            request.context

                    }

                );





            if (

                toolResult

            ) {



                const nativeToolCall =

                    result.toolCalls?.[0];





                if (

                    nativeToolCall?.id

                ) {



                    messages.push({

                        role:

                            "assistant",

                        content:

                            "",


                        toolCalls:

                        [

                            {

                                id:

                                    nativeToolCall.id,

                                name:

                                    nativeToolCall.name,

                                arguments:

                                    nativeToolCall.arguments

                            }

                        ]

                    });





                    messages.push({

                        role:

                            "tool",

                        content:

                            JSON.stringify(toolResult),

                        toolCallId:

                            nativeToolCall.id

                    });


                }

                else {



                    messages.push({

                        role:

                            "assistant",

                        content:

                            "",

                    });





                    messages.push({

                        role:

                            "user",

                        content:

`
Tool execution result:

${JSON.stringify(toolResult)}

Explain this result in Persian.
`

                    });


                }







                result =

                    await this.client.complete(

                        messages

                    );


            }


        }







        await this.saveConversation(

            request,

            result.content

        );







        return {


            content:

                this.responseFormatter.format(

                    result.content

                ),





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







    private async saveConversation(

        request:

            AIRequest,


        content:

            string

    ):

        Promise<void> {



        if (

            !this.memory ||

            !request.userId

        ) {


            return;


        }





        await this.memory.addMessage(

            request.userId,

            {

                role:

                    "user",

                content:

                    request.message,

                createdAt:

                    new Date()

            }

        );





        await this.memory.addMessage(

            request.userId,

            {

                role:

                    "assistant",

                content,

                createdAt:

                    new Date()

            }

        );


    }


}