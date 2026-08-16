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
    AIPromptService
} from "../prompts/AIPromptService";


import {
    AIConversationMemory
}
from "../memory/AIConversationMemory";



export class AIService {



    private readonly promptService:

        AIPromptService;







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

            AIConversationMemory

    ) {



        this.promptService =

            promptService ??

            new AIPromptService(

                toolRegistry

            );


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





            if (

                toolResult

            ) {



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





        if (

            this.memory &&

            request.userId

        ) {


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

                    content:

                        result.content,

                    createdAt:

                        new Date()

                }

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

                            tool =>

                                tool.name

                        )


            }


        };


    }


}