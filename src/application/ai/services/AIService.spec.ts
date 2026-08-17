import {
    describe,
    expect,
    it
}
from "vitest";


import {
    AIService
}
from "./AIService";


import {
    AIClient,
    AICompletionOptions
}
from "../client/AIClient";


import {
    AIMessage
}
from "../client/AIMessage";


import {
    AICompletionResult
}
from "../client/AICompletionResult";


import {
    DefaultAIToolRegistry
}
from "../tools/DefaultAIToolRegistry";


import {
    AIToolExecutionService
}
from "./AIToolExecutionService";


import {
    AIToolDecisionService
}
from "./AIToolDecisionService";


import {
    AIToolExecutor
}
from "../tools/AIToolExecutor";


import {
    MemoryAIConversationStore
}
from "../memory/MemoryAIConversationStore";



class MockAIClient

implements AIClient {


    responses: AICompletionResult[];


    receivedMessages:

        AIMessage[][] = [];


    receivedOptions:

        AICompletionOptions[] = [];



    constructor(

        responses:

            AICompletionResult[]

    ) {

        this.responses = responses;

    }



    async complete(

        messages:

            AIMessage[],

        options?:

            AICompletionOptions

    ):

        Promise<AICompletionResult> {


        this.receivedMessages.push(

            messages

        );


        this.receivedOptions.push(

            options ?? {}

        );


        return this.responses.shift() ?? {

            content:

                ""

        };


    }


}





describe(

    "AIService",

    () => {



        it(

            "should return normal AI response",

            async () => {



                const service =

                    new AIService(

                        new MockAIClient([

                            {

                                content:

                                    "Hello from AI"

                            }

                        ])

                    );



                const result =

                    await service.process({

                        message:

                            "Hello",

                        userId:

                            "user-1"

                    });



                expect(

                    result.content

                )

                    .toBe(

                        "Hello from AI"

                    );



            }

        );






        it(

            "should execute native tool call and continue conversation",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();



                registry.register({

                    name:

                        "test_tool",



                    description:

                        "test tool",



                    async execute() {


                        return {


                            success:

                                true,


                            data:

                            {

                                value:

                                    100

                            }


                        };


                    }


                });





                const toolService =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),

                        new AIToolExecutor(

                            registry

                        )

                    );





                const client =

                    new MockAIClient([

                        {

                            content:

                                "",


                            toolCalls:

                            [

                                {

                                    id:

                                        "call-1",


                                    name:

                                        "test_tool",


                                    arguments:

                                    {}

                                }

                            ]

                        },


                        {

                            content:

                                "Tool result processed"

                        }

                    ]);





                const service =

                    new AIService(

                        client,

                        registry,

                        toolService

                    );





                const result =

                    await service.process({

                        message:

                            "Run tool"

                    });



                expect(

                    result.content

                )

                    .toBe(

                        "Tool result processed"

                    );





                expect(

                    result.metadata?.toolExecuted

                )

                    .toBe(

                        true

                    );





                expect(

                    result.metadata?.toolSuccess

                )

                    .toBe(

                        true

                    );





                expect(

                    client.receivedMessages[1]

                )

                    .toEqual(

                        expect.arrayContaining([

                            {

                                role:

                                    "assistant",

                                content:

                                    "",

                                toolCalls:

                                [

                                    {

                                        id:

                                            "call-1",

                                        name:

                                            "test_tool",

                                        arguments:

                                        {}

                                    }

                                ]

                            },

                            {

                                role:

                                    "tool",

                                content:

                                    JSON.stringify({

                                        success:

                                            true,

                                        data:

                                        {

                                            value:

                                                100

                                        }

                                    }),

                                toolCallId:

                                    "call-1"

                            }

                        ])

                    );


            }

        );






        it(

            "should execute legacy tool call and continue conversation",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();



                registry.register({

                    name:

                        "test_tool",



                    description:

                        "test tool",



                    async execute() {


                        return {


                            success:

                                true,


                            data:

                            {

                                value:

                                    100

                            }


                        };


                    }


                });





                const toolService =

                    new AIToolExecutionService(

                        new AIToolDecisionService(),

                        new AIToolExecutor(

                            registry

                        )

                    );





                const service =

                    new AIService(

                        new MockAIClient([

                            {

                                content:

`
<tool>
{
    "toolName":"test_tool",
    "input":{}
}
</tool>
`

                            },


                            {

                                content:

                                    "Tool result processed"

                            }

                        ]),


                        registry,


                        toolService

                    );





                const result =

                    await service.process({

                        message:

                            "Run tool"

                    });



                expect(

                    result.content

                )

                    .toBe(

                        "Tool result processed"

                    );





                expect(

                    result.metadata?.toolExecuted

                )

                    .toBe(

                        true

                    );





                expect(

                    result.metadata?.toolSuccess

                )

                    .toBe(

                        true

                    );


            }

        );






        it(

            "should expose available tools metadata",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();



                registry.register({

                    name:

                        "sample_tool",



                    description:

                        "sample",



                    async execute() {


                        return {

                            success:

                                true

                        };


                    }


                });





                const service =

                    new AIService(

                        new MockAIClient([

                            {

                                content:

                                    "response"

                            }

                        ]),


                        registry

                    );





                const result =

                    await service.process({

                        message:

                            "test"

                    });



                expect(

                    result.metadata?.availableTools

                )

                    .toContain(

                        "sample_tool"

                    );


            }

        );






        it(

            "should pass available tools to AI client",

            async () => {



                const registry =

                    new DefaultAIToolRegistry();



                registry.register({

                    name:

                        "sample_tool",



                    description:

                        "sample tool",



                    async execute() {


                        return {

                            success:

                                true

                        };


                    }


                });





                const client =

                    new MockAIClient([

                        {

                            content:

                                "response"

                        }

                    ]);





                const service =

                    new AIService(

                        client,

                        registry

                    );





                await service.process({

                    message:

                        "test"

                });





                expect(

                    client.receivedOptions[0]

                )

                    .toEqual({

                        tools:

                            [

                                {

                                    name:

                                        "sample_tool",

                                    description:

                                        "sample tool",

                                    parameters:

                                        undefined

                                }

                            ]

                    });


            }

        );






        it(

            "should load conversation history before processing",

            async () => {



                const memory =

                    new MemoryAIConversationStore();





                await memory.addMessage(

                    "user-1",

                    {

                        role:

                            "user",

                        content:

                            "اسم من علی است.",

                        createdAt:

                            new Date(

                                "2026-08-16T10:00:00.000Z"

                            )

                    }

                );





                await memory.addMessage(

                    "user-1",

                    {

                        role:

                            "assistant",

                        content:

                            "سلام علی!",

                        createdAt:

                            new Date(

                                "2026-08-16T10:00:01.000Z"

                            )

                    }

                );





                const client =

                    new MockAIClient([

                        {

                            content:

                                "سلام دوباره علی!"

                        }

                    ]);





                const service =

                    new AIService(

                        client,

                        undefined,

                        undefined,

                        undefined,

                        memory

                    );





                await service.process({

                    message:

                        "من را یادت هست؟",

                    userId:

                        "user-1"

                });





                const messages =

                    client.receivedMessages[0];





                expect(

                    messages

                )

                    .toEqual(

                        expect.arrayContaining([

                            {

                                role:

                                    "user",

                                content:

                                    "اسم من علی است."

                            },

                            {

                                role:

                                    "assistant",

                                content:

                                    "سلام علی!"

                            },

                            {

                                role:

                                    "user",

                                content:

                                    "من را یادت هست؟"

                            }

                        ])

                    );


            }

        );






        it(

            "should persist user and assistant messages",

            async () => {



                const memory =

                    new MemoryAIConversationStore();





                const service =

                    new AIService(

                        new MockAIClient([

                            {

                                content:

                                    "پاسخ اول"

                            }

                        ]),


                        undefined,


                        undefined,


                        undefined,


                        memory

                    );





                await service.process({

                    message:

                        "سوال اول",

                    userId:

                        "user-1"

                });





                const history =

                    await memory.getHistory(

                        "user-1"

                    );





                expect(

                    history

                )

                    .toHaveLength(

                        2

                    );





                expect(

                    history[0]

                )

                    .toMatchObject({

                        role:

                            "user",

                        content:

                            "سوال اول"

                    });





                expect(

                    history[1]

                )

                    .toMatchObject({

                        role:

                            "assistant",

                        content:

                            "پاسخ اول"

                    });


            }

        );



    }

);