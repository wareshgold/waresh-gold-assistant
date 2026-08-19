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



        if (toolExecutionService) {

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


            const casualResponse =
                this.casualMessageGuard.handle(
                    request.message
                );



            if (casualResponse) {

                return {

                    content:
                        casualResponse,


                    metadata: {

                        model:
                            "local",


                        userId:
                            request.userId,


                        toolExecuted:
                            false,


                        aiProviderCalled:
                            false

                    }

                };

            }





            if (this.localToolRouter) {


                const localResult =
                    await this.localToolRouter.route(
                        request
                    );



                if (localResult.handled) {


                    const content =
                        this.responseFormatter.format(
                            localResult.response ?? ""
                        );



                    await this.saveConversation(
                        request,
                        content
                    );



                    return {

                        content,


                        metadata: {

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

                    ...history

                        .slice(-6)

                        .map(item => ({

                            role:
                                item.role,

                            content:
                                item.content.slice(
                                    0,
                                    500
                                )

                        }))

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





            const toolDefinitions =
                this.toolRegistry?.getToolDefinitions();




            let result =
                await this.client.complete(

                    messages,

                    toolDefinitions

                        ? {

                            tools:
                                toolDefinitions

                        }

                        : undefined

                );





            let executions:
                Array<{

                    toolCallId:
                        string;


                    toolName:
                        string;


                    result:
                        any;

                }> = [];





            if (this.toolExecutionService) {


                executions =
                    await this.toolExecutionService.executeAll(

                        result,

                        {

                            userId:
                                request.userId,


                            metadata:
                                request.context

                        }

                    );

            }





            if (executions.length > 0) {


                messages.push({

                    role:
                        "assistant",

                    content:
                        result.content ?? "",

                    toolCalls:

                        result.toolCalls?.map(

                            toolCall => ({

                                id:
                                    toolCall.id ?? "",

                                name:
                                    toolCall.name,

                                arguments:
                                    toolCall.arguments

                            })

                        )

                });





                for (const execution of executions) {


                    messages.push({

                        role:
                            "tool",

                        content:
                            JSON.stringify(
                                execution.result
                            ),

                        toolCallId:
                            execution.toolCallId

                    });

                }





                result =
                    await this.client.complete(

                        messages,

                        toolDefinitions

                            ? {

                                tools:
                                    toolDefinitions

                            }

                            : undefined

                    );

            }





            const content =
                this.responseFormatter.format(
                    result.content
                );





            await this.saveConversation(
                request,
                content
            );





            return {

                content,


                metadata: {

                    model:
                        result.model,


                    usage:
                        result.usage,


                    userId:
                        request.userId,


                    toolExecuted:
                        executions.length > 0,


                    toolCount:
                        executions.length,


                    toolSuccess:

                        executions.length > 0

                            ? executions.every(

                                execution =>

                                    execution.result.success

                            )

                            : undefined,



                    toolName:

                        executions.length > 0

                            ? executions[0].toolName

                            : undefined,



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


        if (!this.metricRecorder) {

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