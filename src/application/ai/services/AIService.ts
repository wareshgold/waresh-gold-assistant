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


import {
    AILocalToolRouter
}
from "./AILocalToolRouter";


import {
    AICasualMessageGuard
}
from "../guards/AICasualMessageGuard";


import {
    MetricRecorder
}
from "../../system/observability/MetricRecorder";


import {
    MetricType
}
from "../../../domain/system/observability/MetricType";



export class AIService {


    private readonly promptService:

        AIPromptService;



    private readonly responseFormatter:

        AIResponseFormatter;



    private readonly casualMessageGuard:

        AICasualMessageGuard;



    private readonly localToolRouter?:

        AILocalToolRouter;





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

            AIResponseFormatter,


        private readonly metricRecorder?:

            MetricRecorder

    ) {


        this.promptService =

            promptService ??

            new AIPromptService(

                toolRegistry

            );





        this.responseFormatter =

            responseFormatter ??

            new AIResponseFormatter();





        this.casualMessageGuard =

            new AICasualMessageGuard();





        /*
         * Local deterministic tool routing requires both:
         *
         * 1. A tool registry
         * 2. A tool execution service
         *
         * This keeps local routing separate from AI-driven
         * tool execution.
         *
         * When only AIToolExecutionService is provided, the
         * AIService must use the AI-driven tool-call flow.
         */


        if (

            toolExecutionService &&

            toolRegistry

        ) {


            this.localToolRouter =

                new AILocalToolRouter(

                    toolExecutionService

                );


        }


    }







    async process(

        request:

            AIRequest

    ):

        Promise<AIResponse> {



        const startedAt =

            Date.now();





        try {


            /*
             * ---------------------------------------------------------
             * 1. Local casual message handling
             * ---------------------------------------------------------
             *
             * Greetings and other deterministic messages should never
             * reach the external AI provider.
             *
             */


            const casualResponse =

                this.casualMessageGuard.handle(

                    request.message

                );





            if (

                casualResponse

            ) {


                return {

                    content:

                        casualResponse,



                    metadata:

                    {

                        model:

                            "local",


                        userId:

                            request.userId,


                        toolExecuted:

                            false,


                        toolSuccess:

                            false,


                        aiProviderCalled:

                            false

                    }

                };


            }





            /*
             * ---------------------------------------------------------
             * 2. Local deterministic tool routing
             * ---------------------------------------------------------
             *
             * Requests such as:
             *
             *   قیمت طلا چنده؟
             *   قیمت طلای 18 چنده؟
             *   قیمت مثقال چنده؟
             *
             * do not require an LLM round-trip.
             *
             *
             * IMPORTANT:
             *
             * This route is enabled only when both a registry and
             * execution service were provided to the constructor.
             *
             */


            if (

                this.localToolRouter

            ) {


                const localResult =

                    await this.localToolRouter.route(

                        request

                    );





                if (

                    localResult.handled

                ) {


                    const content =

                        this.responseFormatter.format(

                            localResult.response ??

                            ""

                        );





                    await this.saveConversation(

                        request,

                        content

                    );





                    return {

                        content,



                        metadata:

                        {

                            model:

                                "local-tool-router",


                            userId:

                                request.userId,


                            toolExecuted:

                                Boolean(

                                    localResult.toolResult

                                ),


                            toolSuccess:

                                localResult.toolResult?.success,


                            toolName:

                                localResult.toolName,


                            aiProviderCalled:

                                false,


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





            /*
             * ---------------------------------------------------------
             * 3. Build AI conversation context
             * ---------------------------------------------------------
             */


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





                const recentHistory =

                    history.slice(

                        -6

                    );





                console.log(

                    "AI_CONTEXT_SIZE",

                    {

                        totalHistory:

                            history.length,


                        usedHistory:

                            recentHistory.length

                    }

                );





                messages.push(

                    ...recentHistory.map(

                        item => ({

                            role:

                                item.role,

                            content:

                                item.content.slice(

                                    0,

                                    500

                                )

                        })

                    )

                );


            }





            messages.push({

                role:

                    "user",

                content:

                    request.message.slice(

                        0,

                        1000

                    )

            });





            console.log(

                "AI_REQUEST_CONTEXT",

                {

                    messages:

                        messages.length

                }

            );





            /*
             * ---------------------------------------------------------
             * 4. NVIDIA / external AI request
             * ---------------------------------------------------------
             */


            const toolDefinitions =

                this.toolRegistry

                    ?.getToolDefinitions();





            let result =

                await this.client.complete(

                    messages,

                    toolDefinitions

                        ?

                        {

                            tools:

                                toolDefinitions

                        }

                        :

                        undefined

                );





            console.log(

                "AI_FIRST_RESULT",

                {

                    content:

                        result.content,


                    toolCalls:

                        result.toolCalls

                }

            );





            /*
             * ---------------------------------------------------------
             * 5. AI-selected tool execution
             * ---------------------------------------------------------
             *
             * This path is intentionally separate from the local
             * deterministic router above.
             *
             * Flow:
             *
             * AI
             *  ↓
             * Tool Call
             *  ↓
             * Tool Execution
             *  ↓
             * Tool Result
             *  ↓
             * AI again
             *  ↓
             * Final Response
             *
             */


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

                        nativeToolCall

                    ) {


                        const toolCallId =

                            nativeToolCall.id ??

                            `tool-call-${Date.now()}`;





                        messages.push({

                            role:

                                "assistant",

                            content:

                                "",


                            toolCalls:

                            [

                                {

                                    id:

                                        toolCallId,


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

                                JSON.stringify(

                                    toolResult

                                ),


                            toolCallId

                        });


                    }

                    else {


                        messages.push({

                            role:

                                "assistant",

                            content:

                                ""

                        });





                        messages.push({

                            role:

                                "user",

                            content:

`Tool execution result:

${JSON.stringify(toolResult)}

Explain this result in Persian.`

                        });


                    }





                    result =

                        await this.client.complete(

                            messages,

                            toolDefinitions

                                ?

                                {

                                    tools:

                                        toolDefinitions

                                }

                                :

                                undefined

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

                        Boolean(

                            toolResult

                        ),


                    toolSuccess:

                        toolResult?.success,


                    aiProviderCalled:

                        true,


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

        finally {


            await this.recordDuration(

                MetricType.AI_SERVICE_DURATION,

                Date.now() - startedAt

            );


        }


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